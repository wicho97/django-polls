from django.forms import ModelForm

from .models import Question


class QuestionForm(ModelForm):

    class Meta:
        model = Question
        fields = '__all__'

    # agregar clase 'form-control a todos los inputs definidos en fields'
    def __init__(self, *args, **kwargs):
        super(QuestionForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'
            visible.field.widget.attrs['autocomplete'] = 'off'
