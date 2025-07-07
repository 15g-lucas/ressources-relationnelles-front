// middleware/guest.js
export default defineNuxtRouteMiddleware((to, from) => {
  // Vérifier si useAuth est disponible
  if (process.client) {
    try {
      const { isLoggedIn } = useAuth()
      
      // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
      if (isLoggedIn.value) {
        return navigateTo('/dashboard')
      }
    } catch (error) {
      console.log('Auth pas encore initialisé')
      // Si useAuth n'est pas encore disponible, continuer
    }
  }
})