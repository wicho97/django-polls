from django.urls import path
from . import views

app_name = 'polls'
urlpatterns = [
    path('question/',
         views.QuestionListView.as_view(),
         name='subject_list'),
    path('question/<pk>/',
         views.QuestionDetailView.as_view(),
         name='subject_detail'),
]
