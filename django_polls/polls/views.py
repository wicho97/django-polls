from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse, reverse_lazy
from django.views import generic
from django.utils import timezone
from django.contrib import messages
from django.contrib.auth import views as auth_views
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required

from .models import Question, Choice

from .forms import QuestionForm

# Create your views here.


class IndexView(generic.ListView):
    template_name = "polls/index.html"
    context_object_name = "latest_question_list"
    paginate_by = 5

    def get_queryset(self):
        """
        Return the last five published questions (not including those set to be
        published in the future).
        """
        query = self.request.GET.get('search', '')
        if query:
            return Question.objects.filter(question_text__icontains=query).order_by("-pub_date")
        return Question.objects.filter(pub_date__lte=timezone.now()).order_by("-pub_date")


class DetailView(generic.DetailView):
    model = Question
    template_name = "polls/detail.html"

    def get_queryset(self):
        """
        Excludes any questions that aren't published yet.
        """
        return Question.objects.filter(pub_date__lte=timezone.now())


class ResultsView(generic.DetailView):
    model = Question
    template_name = "polls/results.html"


def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(
            request,
            "polls/detail.html",
            {
                "question": question,
                "error_message": "You didn't select a choice.",
            },
        )
    else:
        selected_choice.votes += 1
        selected_choice.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse("polls:results", args=(question.id,)))

@login_required
def create_question(request):
    if request.method == 'POST':
        form = QuestionForm(request.POST)
        if form.is_valid():
            form.save(commit=True)
            form = QuestionForm()
            context = {'form': form}
            messages.success(request, 'Pregunta registrada!')
            return render(request, 'polls/create.html', context)
    else:
        form = QuestionForm()
    context = {'form': form}
    return render(request, 'polls/create.html', context)

@login_required
def update_question(request, question_id):
    question = Question.objects.get(id=question_id)
    if request.method == 'POST':
        form = QuestionForm(request.POST)
        if form.is_valid():
            form.save(commit=True)
            form = QuestionForm()
            context = {'form': form}
            messages.success(request, 'Pregunta actualizada!')
            return render(request, 'polls/update.html', context)
    else:
        form = QuestionForm(instance=question)
    context = {'form': form}
    return render(request, 'polls/update.html', context)

@login_required
def delete_question(request, question_id):
    question = Question.objects.get(id=question_id)
    question.delete()
    questions = Question.objects.all()
    context = {'questions': questions}
    messages.success(request, 'Pregunta eliminada!')
    return render(request, 'polls/index.html', context)
