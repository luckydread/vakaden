from django.urls import path
from . import views
from .views.tradesmen import TradesmanListView, ApproveTradesmanView

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('register', views.RegisterView.as_view(), name='register'),
    path('login', views.CustomLoginView.as_view(), name='login'),
    path('logout', views.LogoutView.as_view(), name='logout'),
    path('verify-token', views.TokenVerifyView.as_view(), name='token_verify'),
    path('refresh-token', views.RefreshTokenView.as_view(), name='refresh_token'),
    path('password-reset', views.PasswordResetView.as_view(), name='password_reset'),
    path('password-reset-confirm/<uidb64>/<token>', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('tradesmen', TradesmanListView.as_view(), name='tradesmen_list'),
    path('tradesmen/<int:tradesman_id>/approve', ApproveTradesmanView.as_view(), name='approve_tradesman'),
    #path('register', views.RegisterView.as_view(), name='register'),
    #path('login', views.LoginView.as_view(), name='login'),
   # path('clear-session', views.ClearSessionView.as_view(), name='clear_session'),
    #path('check-session', views.CheckSessionView.as_view(), name='check_session'),
   # path('create-checkout-session', views.CreateCheckoutSessionView.as_view(), name='create_checkout_session'),
   # path('payment/success', views.PaymentSuccessView.as_view(), name='payment_success'),
   # path('payment/cancel', views.PaymentCancelView.as_view(), name='payment_cancel'),
]
