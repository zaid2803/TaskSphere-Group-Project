from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'api/tasks', views.TaskViewSet)

urlpatterns = [
    # Website
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('dashboard/', views.dashboard_view, name='dashboard'),

    path('add-task/', views.add_task_view, name='add_task'),
    path('edit-task/<int:task_id>/', views.edit_task_view, name='edit_task'),
    path('delete-task/<int:task_id>/', views.delete_task_view, name='delete_task'),
    path('toggle-status/<int:task_id>/', views.toggle_status_view, name='toggle_status'),
    path('logout/', views.logout_view, name='logout'),

    # REST API
    path('', include(router.urls)),
]