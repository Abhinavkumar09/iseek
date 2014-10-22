from django.conf.urls import patterns, include, url
import os
from django.conf import settings

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'crm.views.index', name='index'),

    url(r'^new_game/$', 'crm.views.new_game', name='new_game'),
    url(r'^readEmployee/$', 'crm.openERP.read_employee', name='read_employee'),
    url(r'^addEmployee/$', 'crm.openERP.add_employee', name='add_employee'),
    url(r'^editEmployee/$', 'crm.openERP.edit_employee', name='edit_employee'),
    url(r'^createInvoice/$', 'crm.api_openERP.createInvoice', name='createInvoice'),
    url(r'^getInvoice/$', 'crm.api_openERP.getInvoice', name='getInvoice'),


    url(r'^game/(?P<name>.*)/$', 'crm.views.game', name='game'),
    url(r'^newuser/$', 'crm.user.newuser', name='newuser'),

    url(r'^build/game/(?P<name>.*)/$', 'crm.build.game', name='buildgame'),

    url(r'^login/$', 'crm.login.run'),
    url(r'^logout/$', 'crm.logout.run'),

    url(r'^site_media/(?P<path>.*)$', 'django.views.static.serve', {'document_root':os.path.join(settings.ROOT_PATH, '../site_media'), 'show_indexes': True}),
)
