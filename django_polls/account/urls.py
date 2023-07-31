from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'account'
urlpatterns = [
    # login / logout urls
    path(
        route='login/',
        view=auth_views.LoginView.as_view(),
        name='login'
    ),
    path(
        route='logout/',
        view=auth_views.LogoutView.as_view(),
        name='logout'
    ),
    # change password urls
    path(
        route='password-change/',
        view=auth_views.PasswordChangeView.as_view(),
        name='password_change'
    ),
    path(
        route='password-change/done/',
        view=auth_views.PasswordChangeDoneView.as_view(),
        name='password_change_done'
    ),
    path(
        route='',
        view=views.dashboard,
        name='dashboard'
    ),
]
