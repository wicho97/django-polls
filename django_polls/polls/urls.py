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
        route="<int:question_id>/",
        view=views.DetailView.as_view(),
        name="detail"
    ),
    # ex: /polls/5/results/
    path(
        route="<int:question_id>/results/",
        view=views.ResultsView.as_view(),
        name="results"
    ),
    # ex: /polls/5/vote/
    path(
        route="<int:question_id>/vote/",
        view=views.vote,
        name="vote"
    ),
]
