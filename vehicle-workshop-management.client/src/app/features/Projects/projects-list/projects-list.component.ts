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

  // Customers data for dropdown
  customersDataSource: any[] = [];
  selectedCustomer: any = null;

  // Popup controls
  isProjectPopupOpened = false;
  isTasksPopupOpened = false;
  selectedProjectId: number | null = null;
  selectedProject: any = null;

  // Current project for editing/adding
  currentProject: any = {
    customerId: 0,
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    status: 'Planning'
  };

  popupTitle = 'Add Project';

  // Status options - updated to match API responses
  statusList = ['Planning', 'In Progress', 'Ongoing', 'On Hold', 'Completed', 'Cancelled'];

  constructor(private apiService: ApiService) {
    this.loadCustomers();
  }

  // CRUD Operations
  loadCustomers() {
    this.apiService.get('Customers').subscribe({
      next: (data: any) => {
        this.customersDataSource = data || [];
      },
      error: (error) => {
        notify(`Error loading customers: ${error.message}`, 'error', 2000);
        this.customersDataSource = [];
      }
    });
  }

  addProject() {
    this.currentProject = {
      customerId: 0,
      name: '',
      description: '',
      startDate: null,
      endDate: null,
      status: 'Planning'
    };
    this.selectedCustomer = null;
    this.popupTitle = 'Add Project';
    this.isProjectPopupOpened = true;
  }

  editProject(project: any) {
    this.currentProject = {
      ...project,
      // Convert date strings to Date objects for the form, handle nulls
      startDate: project.startDate ? new Date(project.startDate) : null,
      endDate: project.endDate ? new Date(project.endDate) : null
    };

    // Find and set the selected customer - use the customer object, not just ID
    this.selectedCustomer = this.customersDataSource.find(c => c.customerId === project.customerId) || null;

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
    // Validate required fields
    if (!this.currentProject.name?.trim()) {
      notify('Project name is required', 'error', 2000);
      return;
    }

    if (!this.selectedCustomer) {
      notify('Please select a customer', 'error', 2000);
      return;
    }

    // Set customer ID from selected customer
    this.currentProject.customerId = this.selectedCustomer.customerId;

    // Prepare project data for API
    const projectData = {
      ...this.currentProject,
      // Convert dates to proper format for API, handle nulls
      startDate: this.currentProject.startDate ? this.formatDateForApi(this.currentProject.startDate) : null,
      endDate: this.currentProject.endDate ? this.formatDateForApi(this.currentProject.endDate) : null
    };

    const action = this.popupTitle === 'Add Project'
      ? this.apiService.post('Projects', projectData)
      : this.apiService.put('Projects', this.currentProject.projectId, {
        customerId: projectData.customerId, // Include customerId in edit
        name: projectData.name,
        description: projectData.description,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        status: projectData.status
      });

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
        this.projectTasksDataSource = data || [];
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

  formatDate = ({ value }: { value: string | null }) => {
    if (!value) return 'Not set';
    return new Date(value).toLocaleDateString('en-GB');
  };

  formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  };

  getCustomerName = (customerId: number): string => {
    if (!customerId) return 'Unknown Customer';
    const customer = this.customersDataSource.find(c => c.customerId === customerId);
    return customer ? customer.name : `Customer #${customerId}`;
  };

  getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-in-progress';
      case 'Ongoing': return 'status-ongoing';
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
