from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, permission_classes

from polls.models import Question, Choice
from polls.api.serializers import QuestionSerializer, ChoiceSerializer


class CustomResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    # Max results per page
    max_page_size = 1000


class QuestionListCreateView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    pagination_class = CustomResultsSetPagination

    @permission_classes([IsAuthenticated])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class QuestionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]


class ChoiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ChoiceSerializer
    pagination_class = CustomResultsSetPagination

    def get_queryset(self):
        question_id = self.kwargs['pk']
        return Choice.objects.filter(question=question_id)


class ChoiceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChoiceSerializer

    def get_queryset(self):
        choice_id = self.kwargs['choice_id']
        return Choice.objects.filter(id=choice_id)
