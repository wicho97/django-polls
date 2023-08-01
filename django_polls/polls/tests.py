import datetime

from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User
from django.conf import settings

from .models import Question, Choice

# Create your tests here.


class QuestionModelTests(TestCase):
    def test_was_published_recently_with_future_question(self):
        """
        was_published_recently() returns False for questions whose pub_date
        is in the future.
        si a una pregunta (Question) futura con fecha de publicacion futura(un mes) se le aplica el metodo was_published_recently tiene que retornarme falso 
        """
        time = timezone.now() + datetime.timedelta(days=30)
        future_question = Question(pub_date=time)
        self.assertIs(future_question.was_published_recently(), False)

    def test_was_published_recently_with_old_question(self):
        """
        was_published_recently() returns False for questions whose pub_date
        is older than 1 day.
        si a una pregunta (Question) antigua con fecha de publicacion antigua (un dia y un segundo) se le aplica el metodo was_published_recently tiene que retornarme falso 
        """
        time = timezone.now() - datetime.timedelta(days=1, seconds=1)
        old_question = Question(pub_date=time)
        self.assertIs(old_question.was_published_recently(), False)

    def test_was_published_recently_with_recent_question(self):
        """
        was_published_recently() returns True for questions whose pub_date
        is within the last day.
        si a una pregunta (Question) reciente con fecha de publicacion reciente (23 horas, 59 minutos y 59 segundos) se le aplica el metodo was_published_recently tiene que retornarme true 
        """
        time = timezone.now() - datetime.timedelta(hours=23, minutes=59, seconds=59)
        recent_question = Question(pub_date=time)
        self.assertIs(recent_question.was_published_recently(), True)


def create_question(question_text, days):
    """
    Create a question with the given `question_text` and published the
    given number of `days` offset to now (negative for questions published
    in the past, positive for questions that have yet to be published).
    """
    time = timezone.now() + datetime.timedelta(days=days)
    return Question.objects.create(question_text=question_text, pub_date=time)


def create_choice(question, choice_text):
    return Choice.objects.create(question=question, choice_text=choice_text)


class QuestionIndexViewTests(TestCase):
    def test_no_questions(self):
        """
        If no questions exist, an appropriate message is displayed.
        """
        response = self.client.get(reverse("polls:index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "No polls are available.")
        self.assertQuerySetEqual(response.context["latest_question_list"], [])

    def test_past_question(self):
        """
        Questions with a pub_date in the past are displayed on the
        index page.
        """
        question = create_question(question_text="Past question.", days=-30)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(
            response.context["latest_question_list"],
            [question],
        )
        self.assertContains(response, question.question_text)

    def test_future_question(self):
        """
        Questions with a pub_date in the future aren't displayed on
        the index page.
        """
        create_question(question_text="Future question.", days=30)
        response = self.client.get(reverse("polls:index"))
        self.assertContains(response, "No polls are available.")
        self.assertQuerySetEqual(response.context["latest_question_list"], [])

    def test_future_question_and_past_question(self):
        """
        Even if both past and future questions exist, only past questions
        are displayed.
        """
        question = create_question(question_text="Past question.", days=-30)
        create_question(question_text="Future question.", days=30)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(
            response.context["latest_question_list"],
            [question],
        )

    def test_two_past_questions(self):
        """
        The questions index page may display multiple questions.
        """
        question1 = create_question(question_text="Past question 1.", days=-30)
        question2 = create_question(question_text="Past question 2.", days=-5)
        response = self.client.get(reverse("polls:index"))
        self.assertQuerySetEqual(
            response.context["latest_question_list"],
            [question2, question1],
        )


class QuestionDetailViewTests(TestCase):
    def test_future_question(self):
        """
        The detail view of a question with a pub_date in the future
        returns a 404 not found.
        """
        future_question = create_question(
            question_text="Future question.",
            days=5
        )
        url = reverse("polls:detail", args=(future_question.id,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_past_question(self):
        """
        The detail view of a question with a pub_date in the past
        displays the question's text.
        """
        past_question = create_question(
            question_text="Past Question.", days=-5)
        url = reverse("polls:detail", args=(past_question.id,))
        response = self.client.get(url)
        self.assertContains(response, past_question.question_text)


class VotesTests(TestCase):
    def test_question_not_exits_should_return_404(self):
        url = reverse('polls:vote', args=(1,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_question_if_exits_should_return_200(self):
        question = create_question(
            question_text="Question", days=0)

        url = reverse('polls:vote', args=(question.id,))
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_vote(self):
        """Dado una pregunta con 3 opciones la opcion, el numero de votos elejida por el usuario debe ser 1"""
        question = create_question(question_text="Question?", days=0)
        create_choice(question, choice_text='Choice 1')
        selected_choice = create_choice(question, choice_text='Choice 2')
        create_choice(question, choice_text='Choice 3')

        url = reverse('polls:vote', args=(question.id,))
        response = self.client.post(
            url, {"choice": selected_choice.id}, follow=True)

        # selected_choice = question.choice_set.get(pk=2)
        # usamos refresh_from_db() para sincronizar el objeto con la db dado que no se actualiza automaticamente porque la vista es la que actualiza los votos
        selected_choice.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(selected_choice.votes, 1)

    def test_redirect(self):
        question = create_question(question_text="Question", days=0)
        selected_choice = create_choice(question, choice_text='Choice 2')

        url = reverse('polls:vote', args=(question.id,))
        response = self.client.post(url, {"choice": selected_choice.id})

        url_results = reverse('polls:results', args=(question.id,))
        self.assertRedirects(response, url_results)


class AuthenticationTests(TestCase):

    def test_only_authenticated_user_should_able_to_edit_a_questions(self):
        User.objects.create_user(
            username="test", email="test@test.com", password="test")
        question = create_question(question_text="Question", days=0)

        # User login
        self.client.login(username="test", password="test")

        # User visit edit question
        url = reverse('polls:update_question', args=(question.id,))
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)


class NonAuthenticationTests(TestCase):

    def test_non_authenticated_user_should_not_able_to_edit_a_questions(self):
        question = create_question(question_text="Question", days=0)

        # User visit edit question
        url = reverse('polls:update_question', args=(question.id,))
        response = self.client.get(url, follow=True)

        self.assertRedirects(
            response, f"/account/login/?next=/polls/{ question.id }/update/")
