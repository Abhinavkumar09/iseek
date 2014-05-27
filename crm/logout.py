from django.http import HttpResponseRedirect
from django.contrib.auth import logout

def run(request):
  logout(request)
  return HttpResponseRedirect('/')
