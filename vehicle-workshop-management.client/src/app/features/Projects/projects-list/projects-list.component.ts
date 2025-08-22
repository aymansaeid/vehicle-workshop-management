import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxDataGridModule,
  DxDataGridComponent,
  DxButtonModule,
  DxPopupModule,
  DxTextBoxModule,
  DxTextAreaModule,
  DxSelectBoxModule,
  DxDateBoxModule,
  DxValidatorModule,
  DxFormModule,
  DxLoadPanelModule
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { ApiService } from '../../../api/api';
import notify from "devextreme/ui/notify";

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxPopupModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxValidatorModule,
    DxFormModule,
    DxLoadPanelModule
  ]
})
export class ProjectsListComponent {
  @ViewChild(DxDataGridComponent, { static: true }) dataGrid!: DxDataGridComponent;

  // Projects data
  dataSource = new DataSource({
    key: 'projectId',
    load: () => new Promise((resolve, reject) => {
      this.apiService.get('Projects').subscribe({
        next: (data: any) => resolve(data),
        error: ({ message }) => reject(message)
      });
    }),
  });

  // Project tasks data
  projectTasksDataSource: any[] = [];
  
  // Popup controls
  isProjectPopupOpened = false;
  isTasksPopupOpened = false;
  selectedProjectId: number | null = null;
  selectedProject: any = null;
  
  // Current project for editing/adding
  currentProject: any = {
    name: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'Planning',
    budget: 0
  };
  
  popupTitle = 'Add Project';
  
  // Status options
  statusList = ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

  constructor(private apiService: ApiService) {}

  // CRUD Operations
  addProject() {
    this.currentProject = {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'Planning',
      budget: 0
    };
    this.popupTitle = 'Add Project';
    this.isProjectPopupOpened = true;
  }

  editProject(project: any) {
    this.currentProject = { ...project };
    this.popupTitle = 'Edit Project';
    this.isProjectPopupOpened = true;
  }

  deleteProject(projectId: number) {
    this.apiService.get(`Projects/${projectId}/tasks`).subscribe({
      next: (tasks: any) => {
        if (tasks && tasks.length > 0) {
          notify(`Cannot delete project. It contains ${tasks.length} task(s). Please delete all tasks first.`, 'warning', 4000);
        } else {
          if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            this.apiService.delete('Projects', projectId).subscribe({
              next: () => {
                notify('Project deleted successfully', 'success', 2000);
                this.refresh();
              },
              error: (error) => {
                notify(`Error deleting project: ${error.message}`, 'error', 2000);
              }
            });
          }
        }
      },
      error: (error) => {
        notify(`Error checking project tasks: ${error.message}`, 'error', 2000);
      }
    });
  }

  onSaveProject() {
    const action = this.popupTitle === 'Add Project'
      ? this.apiService.post('Projects', this.currentProject)
      : this.apiService.put('Projects', this.currentProject.projectId, this.currentProject);

    action.subscribe({
      next: () => {
        notify(`Project ${this.popupTitle === 'Add Project' ? 'added' : 'updated'} successfully`, 'success', 2000);
        this.isProjectPopupOpened = false;
        this.refresh();
      },
      error: (error) => {
        notify(`Error ${this.popupTitle === 'Add Project' ? 'adding' : 'updating'} project: ${error.message}`, 'error', 2000);
      }
    });
  }

  onCancelEdit() {
    this.isProjectPopupOpened = false;
  }

  // View project tasks
  viewProjectTasks(project: any) {
    this.selectedProject = project;
    this.loadProjectTasks(project.projectId);
    this.isTasksPopupOpened = true;
  }

  loadProjectTasks(projectId: number) {
    this.apiService.get(`Projects/${projectId}/tasks`).subscribe({
      next: (data: any) => {
        this.projectTasksDataSource = data;
      },
      error: (error) => {
        notify(`Error loading project tasks: ${error.message}`, 'error', 2000);
        this.projectTasksDataSource = [];
      }
    });
  }

  closeTasksPopup() {
    this.isTasksPopupOpened = false;
    this.selectedProject = null;
    this.projectTasksDataSource = [];
  }

  // Utility methods
  refresh() {
    this.dataGrid.instance.refresh();
  }

  formatDate = ({ value }: { value: string }) => {
    return value ? new Date(value).toLocaleDateString('en-GB') : '';
  };

  formatCurrency = (value: number) => {
    return value ? `$${value.toFixed(2)}` : '$0.00';
  };

  getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-in-progress';
      case 'On Hold': return 'status-on-hold';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-planning';
    }
  };

  // Grid event handlers
  onEditClick = (e: any) => {
    const project = e.row?.data;
    if (project) {
      this.editProject(project);
    }
  }

  onDeleteClick = (e: any) => {
    const projectId = e.row?.data?.projectId;
    if (projectId) {
      this.deleteProject(projectId);
    }
  }

  onViewTasksClick = (e: any) => {
    const project = e.row?.data;
    if (project) {
      this.viewProjectTasks(project);
    }
  }
}
