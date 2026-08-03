from datetime import date

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect, get_object_or_404
from .models import Task

from rest_framework import viewsets
from .serializers import TaskSerializer


# ---------------- LOGIN ----------------
def login_view(request):
    if request.method == "POST":

        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('dashboard')

        return render(request, 'accounts/login.html', {
            'error': 'Invalid username or password'
        })

    return render(request, 'accounts/login.html')


# ---------------- REGISTER ----------------
def register_view(request):
    if request.method == "POST":

        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")

        if User.objects.filter(username=username).exists():
            return render(request, "accounts/register.html", {
                "error": "Username already exists"
            })

        User.objects.create_user(username=username, email=email, password=password)

        return redirect("login")

    return render(request, "accounts/register.html")


# ---------------- DASHBOARD ----------------
@login_required
def dashboard_view(request):

    tasks = Task.objects.filter(user=request.user)

    search = request.GET.get('search')
    status = request.GET.get('status')
    sort = request.GET.get('sort')

    if search:
        tasks = tasks.filter(title__icontains=search)

    if status:
        tasks = tasks.filter(status=status)

    if sort == "due_date":
        tasks = tasks.order_by("due_date")
    elif sort == "priority":
        tasks = tasks.order_by("priority")
    else:
        tasks = tasks.order_by("-id")

    total_tasks = tasks.count()
    pending_tasks = tasks.filter(status="Pending").count()
    completed_tasks = tasks.filter(status="Completed").count()

    completion_percentage = (
        (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0
    )

    # ---------------- OVERDUE LOGIC ----------------
    today = date.today()

    for task in tasks:
        task.is_overdue = False

        if task.due_date and task.status != "Completed":
            try:
                task.is_overdue = task.due_date < today
            except:
                task.is_overdue = False

    return render(request, "accounts/dashboard.html", {
        "tasks": tasks,
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks,
        "completion_percentage": completion_percentage,
    })


# ---------------- ADD TASK ----------------
@login_required
def add_task_view(request):

    if request.method == "POST":

        Task.objects.create(
            user=request.user,
            title=request.POST.get('title'),
            description=request.POST.get('description'),
            status=request.POST.get('status'),
            priority=request.POST.get('priority'),
            due_date=request.POST.get('due_date')
        )

        return redirect('dashboard')

    return render(request, 'accounts/add_task.html')


# ---------------- EDIT TASK ----------------
@login_required
def edit_task_view(request, task_id):

    task = get_object_or_404(Task, id=task_id, user=request.user)

    if request.method == "POST":

        task.title = request.POST.get('title')
        task.description = request.POST.get('description')
        task.status = request.POST.get('status')
        task.priority = request.POST.get('priority')
        task.due_date = request.POST.get('due_date')

        task.save()

        return redirect('dashboard')

    return render(request, 'accounts/edit_task.html', {'task': task})


# ---------------- DELETE TASK ----------------
@login_required
def delete_task_view(request, task_id):

    task = get_object_or_404(Task, id=task_id, user=request.user)
    task.delete()

    return redirect('dashboard')


# ---------------- TOGGLE STATUS ----------------
@login_required
def toggle_status_view(request, task_id):

    task = get_object_or_404(Task, id=task_id, user=request.user)

    if task.status == "Pending":
        task.status = "In Progress"
    elif task.status == "In Progress":
        task.status = "Completed"
    else:
        task.status = "Pending"

    task.save()

    return redirect('dashboard')


# ---------------- LOGOUT ----------------
def logout_view(request):
    logout(request)
    return redirect('login')

# ---------------- REST API ----------------
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer