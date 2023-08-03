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
        route="polls/<int:pk>/",
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
    # ex: polls/1/choice/create/
    path(
        "polls/<int:question_id>/choice/create/",
        view=views.create_choice,
        name="create_choice"
    ),
    # ex: polls/1/choice/1/update/
    path(
        "polls/<int:question_id>/choice/<int:choice_id>/update/",
        view=views.update_choice,
        name="update_choice"
    ),
    # ex: polls/1/choice/1/delete/
    path(
        "polls/<int:question_id>/choice/<int:choice_id>/delete/",
        view=views.delete_choice,
        name="delete_choice"
    ),
]
