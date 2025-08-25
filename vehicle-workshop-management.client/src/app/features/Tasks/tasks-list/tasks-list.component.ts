import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxDataGridModule,
  DxDataGridComponent,
  DxButtonModule,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxPopupModule,
  DxDateBoxModule,
  DxNumberBoxModule
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { ApiService } from '../../../api/api';
import notify from "devextreme/ui/notify";

type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Delayed' | 'All';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxPopupModule,
    DxDateBoxModule,
    DxNumberBoxModule
  ]
})
export class TasksListComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true }) dataGrid!: DxDataGridComponent;

  statusList = ['Pending', 'In Progress', 'Completed', 'Delayed'];
  filterStatusList: TaskStatus[] = ['All', 'Pending', 'In Progress', 'Completed', 'Delayed'];

  projects: any[] = [];
  selectedProjectId: number | null = null;
  isAssignProjectPopupOpened = false;
  taskToAssign: any = null;
  isTaskLineEditPopupOpened = false;

  isPanelOpened = false;
  isAddTaskPopupOpened = false;
  selectedTaskId: number | null = null;
  selectedTask: any = null;
  currentTask: any = {
    name: '',
    description: '',
    status: 'Pending',
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    delayReason: ''
  };
  popupTitle = 'Add Task';

  taskLinesDataSource: any[] = [];
  isTaskLinesPopupOpened = false;
  currentTaskLine: any = {
    description: '',
    quantity: 1,
    unitPrice: 0,
    employeeId: null,
    inventoryId: null
  };
  taskLinePopupTitle = 'Add Task Line';
  selectedTaskLineId: number | null = null;
  employees: any[] = [];
  inventories: any[] = [];

  dataSource = new DataSource({
    key: 'taskId',
    load: () => new Promise((resolve, reject) => {
      this.apiService.get('Tasks').subscribe({
        next: (data: any) => resolve(data),
        error: ({ message }) => reject(message)
      });
    }),
  });

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadProjects();
    this.loadEmployees();
    this.loadInventories();
  }

  loadProjects() {
    this.apiService.get('Projects').subscribe({
      next: (data: any) => {
        this.projects = data;
      },
      error: (error) => {
        notify(`Error loading projects: ${error.message}`, 'error', 2000);
      }
    });
  }

  loadEmployees() {
    this.apiService.get('Employees').subscribe({
      next: (data: any) => {
        this.employees = data;
      },
      error: (error) => {
        notify(`Error loading employees: ${error.message}`, 'error', 2000);
      }
    });
  }

  loadInventories() {
    this.apiService.get('Inventories').subscribe({
      next: (data: any) => {
        this.inventories = data;
      },
      error: (error) => {
        notify(`Error loading inventories: ${error.message}`, 'error', 2000);
      }
    });
  }

  onEditClick = (e: any) => {
    const task = e.row?.data;
    if (task) {
      this.editTask(task);
    }
  }

  onDeleteClick = (e: any) => {
    const taskId = e.row?.data?.taskId;
    if (taskId) {
      this.deleteTask(taskId);
    }
  }

  onAssignProjectClick = (e: any) => {
    const task = e.row?.data;
    if (task) {
      this.openAssignProjectPopup(task);
    }
  }

  isStatusButtonVisible = (e: any) => {
    return e.row?.data?.status !== 'Completed';
  }

  openAssignProjectPopup(task: any) {
    this.taskToAssign = task;
    this.selectedProjectId = task.projectId || null;
    this.isAssignProjectPopupOpened = true;
  }

  assignToProject() {
    if (!this.taskToAssign || !this.selectedProjectId) {
      notify('Please select a project', 'error', 2000);
      return;
    }

    this.apiService.assignTaskToProject(this.taskToAssign.taskId, this.selectedProjectId).subscribe({
      next: () => {
        notify('Task assigned to project successfully', 'success', 2000);
        this.isAssignProjectPopupOpened = false;
        this.refresh();
      },
      error: (error) => {
        notify(`Error assigning task: ${error.message}`, 'error', 2000);
      }
    });
  }

  onSelectionChanged(e: any) {
    const selected = e.selectedRowsData[0];
    if (selected) {
      this.selectedTaskId = selected.taskId;
      this.loadTaskDetails(selected.taskId);
    } else {
      this.selectedTaskId = null;
      this.selectedTask = null;
      this.isPanelOpened = false;
    }
  }

  loadTaskDetails(taskId: number) {
    this.apiService.get(`Tasks/${taskId}`).subscribe({
      next: (result: any) => {
        const task = Array.isArray(result) ? result[0] : result;
        this.selectedTask = task;
        this.isPanelOpened = true;
      },
      error: (err) => {
        notify(`Error loading task details: ${err.message}`, 'error', 2000);
        this.selectedTask = null;
      }
    });
  }

  cancelAssignProject() {
    this.isAssignProjectPopupOpened = false;
    this.taskToAssign = null;
    this.selectedProjectId = null;
  }

  addTask() {
    this.currentTask = {
      name: '',
      description: '',
      status: 'Pending',
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      delayReason: ''
    };
    this.popupTitle = 'Add Task';
    this.isAddTaskPopupOpened = true;
  }

  editTask(task: any) {
    this.currentTask = {
      ...task,
      startTime: new Date(task.startTime),
      endTime: new Date(task.endTime)
    };
    this.popupTitle = 'Edit Task';
    this.isAddTaskPopupOpened = true;
  }

  deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.apiService.delete('Tasks', taskId).subscribe({
        next: () => {
          notify('Task deleted successfully', 'success', 2000);
          this.refresh();
        },
        error: (error) => {
          notify(`Error deleting task: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  onSaveTask() {
    const action = this.popupTitle === 'Add Task'
      ? this.apiService.post('Tasks', this.currentTask)
      : this.apiService.put('Tasks', this.currentTask.taskId, this.currentTask);

    action.subscribe({
      next: () => {
        notify(`Task ${this.popupTitle === 'Add Task' ? 'added' : 'updated'} successfully`, 'success', 2000);
        this.isAddTaskPopupOpened = false;
        this.refresh();
      },
      error: (error) => {
        notify(`Error ${this.popupTitle === 'Add Task' ? 'adding' : 'updating'} task: ${error.message}`, 'error', 2000);
      }
    });
  }

  onCancelEdit() {
    this.isAddTaskPopupOpened = false;
  }

  refresh() {
    this.dataGrid.instance.refresh();
  }

  onOpenedChange(e: any) {
    if (!e.value) {
      this.selectedTaskId = null;
      this.selectedTask = null;
    }
  }

  filterByStatus(e: any) {
    const status = e.itemData as TaskStatus;
    status === 'All'
      ? this.dataGrid.instance.clearFilter('status')
      : this.dataGrid.instance.filter(['status', '=', status]);
  }

  formatDate = ({ value }: { value: string }) => {
    return value ? new Date(value).toLocaleDateString('en-GB') : '';
  };

  getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-in-progress';
      case 'Delayed': return 'status-delayed';
      default: return 'status-pending';
    }
  };

  formatCurrency = (value: number) => {
    return value ? `$${value.toFixed(2)}` : '$0.00';
  };

  // Task Lines Management
  loadTaskLines(taskId: number) {
    this.apiService.get(`TaskLines/ByTask/${taskId}`).subscribe({
      next: (data: any) => {
        this.taskLinesDataSource = data;
      },
      error: (error) => {
        notify(`Error loading task lines: ${error.message}`, 'error', 2000);
      }
    });
  }

  openTaskLinesPopup(task: any) {
    this.selectedTask = task;
    this.loadTaskLines(task.taskId);
    this.isTaskLinesPopupOpened = true;
  }

  addTaskLine() {
    this.currentTaskLine = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      employeeId: null,
      inventoryId: null
    };
    this.taskLinePopupTitle = 'Add Task Line';
    this.selectedTaskLineId = null;
    this.isTaskLineEditPopupOpened = true;
  }

  editTaskLine(taskLine: any) {
    this.currentTaskLine = { ...taskLine };
    this.taskLinePopupTitle = 'Edit Task Line';
    this.selectedTaskLineId = taskLine.taskLineId;
    this.isTaskLineEditPopupOpened = true;
  }

  // Fixed editTaskLine button handler
  onEditTaskLineClick = (e: any) => {
    const taskLine = e.row?.data;
    if (taskLine) {
      this.editTaskLine(taskLine);
    }
  }

  onDeleteTaskLineClick = (e: any) => {
    const taskLineId = e.row?.data?.taskLineId;
    if (taskLineId) {
      this.deleteTaskLine(taskLineId);
    }
  }

  deleteTaskLine(taskLineId: number) {
    if (confirm('Are you sure you want to delete this task line?')) {
      this.apiService.delete('TaskLines', taskLineId).subscribe({
        next: () => {
          notify('Task line deleted successfully', 'success', 2000);
          this.loadTaskLines(this.selectedTask.taskId);
        },
        error: (error) => {
          notify(`Error deleting task line: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  onSaveTaskLine() {
    if (this.taskLinePopupTitle === 'Add Task Line') {
      // Create new task line
      this.apiService.post(`TaskLines/tasks/${this.selectedTask.taskId}/Tasklines`, this.currentTaskLine).subscribe({
        next: () => {
          notify('Task line added successfully', 'success', 2000);
          this.isTaskLineEditPopupOpened = false;
          this.loadTaskLines(this.selectedTask.taskId);
        },
        error: (error) => {
          notify(`Error adding task line: ${error.message}`, 'error', 2000);
        }
      });
    } else {
      // Update existing task line
      this.apiService.put('TaskLines', this.selectedTaskLineId!, this.currentTaskLine).subscribe({
        next: () => {
          notify('Task line updated successfully', 'success', 2000);
          this.isTaskLineEditPopupOpened = false;
          this.loadTaskLines(this.selectedTask.taskId);
        },
        error: (error) => {
          notify(`Error updating task line: ${error.message}`, 'error', 2000);
        }
      });
    }
  }

  closeTaskLinesManagement() {
    this.isTaskLinesPopupOpened = false;
  }

  onCancelTaskLineEdit() {
    this.isTaskLineEditPopupOpened = false;
  }

  // Currency format for DevExtreme components
  currencyFormat = {
    type: 'currency',
    currency: 'USD',
    precision: 2
  };

  calculateLineTotal = (rowData: any): number => {
    return rowData.quantity * rowData.unitPrice;
  }

  // Additional utility methods for filtering
  getTasksByProject(projectId: number) {
    this.apiService.get(`Tasks/byProject/${projectId}`).subscribe({
      next: (data) => {
        this.dataSource = new DataSource({
          key: 'taskId',
          load: () => Promise.resolve(data)
        });
      },
      error: (error) => {
        notify(`Error loading tasks: ${error.message}`, 'error', 2000);
      }
    });
  }

  getTasksByStatus(status: string) {
    this.apiService.get(`Tasks/byStatus?status=${status}`).subscribe({
      next: (data) => {
        this.dataSource = new DataSource({
          key: 'taskId',
          load: () => Promise.resolve(data)
        });
      },
      error: (error) => {
        notify(`Error loading tasks: ${error.message}`, 'error', 2000);
      }
    });
  }
}
