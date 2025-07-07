// middleware/admin.js
export default defineNuxtRouteMiddleware((to, from) => {
  // Vérifier si useAuth est disponible
  if (process.client) {
    try {
      const { isLoggedIn, user } = useAuth()
      
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      if (!isLoggedIn.value) {
        return navigateTo('/login')
      }

      // Si l'utilisateur n'est pas admin, rediriger vers le dashboard
      if (!user.value || user.value.role !== 'admin') {
        return navigateTo('/dashboard')
      }
    } catch (error) {
      console.log('Auth pas encore initialisé, redirection vers login')
      return navigateTo('/login')
    }
  }
}) 