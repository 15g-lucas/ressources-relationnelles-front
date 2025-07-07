// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  // Vérifier si useAuth est disponible
  if (process.client) {
    try {
      const { isLoggedIn } = useAuth()
      
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      if (!isLoggedIn.value) {
        return navigateTo('/login')
      }
    } catch (error) {
      console.log('Auth pas encore initialisé, redirection vers login')
      
      return navigateTo('/login')
    }
  }
})