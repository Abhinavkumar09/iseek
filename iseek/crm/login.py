from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django import forms



class LoginForm(forms.Form):
  username = forms.CharField(max_length=100)
  password = forms.CharField(widget=forms.PasswordInput(render_value=False),max_length=100)


# Check if the username, password entered by the user valid or not
def isValidLogin(request):
  username = request.POST['username']
  password = request.POST['password']
    
  user = authenticate(username=username, password=password)

  if user is not None:
    if user.is_active:
      login(request, user)
    else:
      return "The account is locked."
  else:
    return "User does not exist."

# Show login form
def run(request):
  message = ''

  if request.user.is_authenticated():
      return HttpResponseRedirect('/')
  else:
    form = LoginForm();

    if request.POST:
      message = isValidLogin(request)

      if not message:
        return HttpResponseRedirect('/')
      else:
        message = "Wrong Credentials"

    return render_to_response('login.html', {'form':form, 'message':message,'title':"Welcome",})
