from django.urls import path
from . import views

app_name = "polls"
urlpatterns = [
    # ex: /polls/
    path(
        route="",
        view=views.IndexView.as_view(),
        name="index"
    ),
    # ex: /polls/5/
    path(
        route="<int:pk>/",
        view=views.DetailView.as_view(),
        name="detail"
    ),
    # ex: /polls/5/results/
    path(
        route="<int:pk>/results/",
        view=views.ResultsView.as_view(),
        name="results"
    ),
    # ex: /polls/5/vote/
    path(
        route="<int:question_id>/vote/",
        view=views.vote,
        name="vote"
    ),
    # ex: /polls/create/
    path(
        "create/",
        view=views.create_question,
        name="create_question"
    ),
    # ex: /polls/1/update/
    path(
        "<int:question_id>/update/",
        view=views.update_question,
        name="update_question"
    ),
    # ex: /polls/1/delete/
    path(
        "<int:question_id>/delete/",
        view=views.delete_question,
        name="delete_question"
    ),
    path(
        "login/",
        view=views.LoginView.as_view(),
        name="login"
    ),
    path(
        "logout/",
        view=views.LogoutView.as_view(),
        name="logout"
    ),
    # reset password urls
    path(
        "password-reset/",
        view=views.PasswordResetView.as_view(),
        name="password_reset"
    ),
    path(
        "password-reset/done/",
        view=views.PasswordResetDoneView.as_view(),
        name="password_reset_done"
    ),
    path(
        "password-reset/<uidb64>/<token>/",
        view=views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm"
    ),
    path(
        "password-reset/complete/",
        view=views.PasswordResetCompleteView.as_view(),
        name="password_reset_complete"
    ),
]
