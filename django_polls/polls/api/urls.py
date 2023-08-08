from django.urls import path
from . import views

app_name = 'polls'
urlpatterns = [
    # questions
    path(
        route='questions/',
        view=views.QuestionListCreateView.as_view(),
        name='question_list'
    ),
    path(
        route='questions/<int:pk>/',
        view=views.QuestionRetrieveUpdateDestroyView.as_view(),
        name='question_detail'
    ),
    # choices
    path(
        route='questions/<int:pk>/choices/',
        view=views.ChoiceListCreateView.as_view(),
        name='choice_list'
    ),
    path(
        route='questions/<int:pk>/choices/<int:choice_id>/',
        view=views.ChoiceRetrieveUpdateDestroyView.as_view(),
        name='choice_detail'
    ),
]
