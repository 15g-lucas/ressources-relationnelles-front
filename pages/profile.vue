<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/dashboard" class="text-indigo-600 hover:text-indigo-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">Gestion du compte</h1>
          </div>
          <button
            @click="logout"
            class="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Messages d'état -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Navigation latérale -->
        <div class="lg:col-span-1">
          <nav class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Mon compte</h2>
            <ul class="space-y-2">
              <li>
                <button
                  @click="activeTab = 'profile'"
                  :class="[
                    'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                    activeTab === 'profile' 
                      ? 'bg-indigo-100 text-indigo-700 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  ]"
                >
                  📝 Informations personnelles
                </button>
              </li>
              <li>
                <button
                  @click="activeTab = 'password'"
                  :class="[
                    'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                    activeTab === 'password' 
                      ? 'bg-indigo-100 text-indigo-700 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  ]"
                >
                  🔒 Mot de passe
                </button>
              </li>
              <li>
                <button
                  @click="activeTab = 'preferences'"
                  :class="[
                    'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                    activeTab === 'preferences' 
                      ? 'bg-indigo-100 text-indigo-700 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  ]"
                >
                  ⚙️ Préférences
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Contenu principal -->
        <div class="lg:col-span-2">
          <!-- Onglet Informations personnelles -->
          <div v-if="activeTab === 'profile'" class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Informations personnelles</h3>
              <p class="mt-1 text-sm text-gray-600">Mettez à jour vos informations de profil.</p>
            </div>
            
            <form @submit.prevent="updateProfile" class="p-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Prénom -->
                <div>
                  <label for="prenom" class="block text-sm font-medium text-gray-700">
                    Prénom *
                  </label>
                  <input
                    id="prenom"
                    v-model="profileForm.prenom"
                    type="text"
                    required
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    :class="{ 'border-red-500': profileErrors.prenom }"
                  />
                  <p v-if="profileErrors.prenom" class="mt-1 text-sm text-red-600">
                    {{ profileErrors.prenom }}
                  </p>
                </div>

                <!-- Nom -->
                <div>
                  <label for="nom" class="block text-sm font-medium text-gray-700">
                    Nom *
                  </label>
                  <input
                    id="nom"
                    v-model="profileForm.nom"
                    type="text"
                    required
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    :class="{ 'border-red-500': profileErrors.nom }"
                  />
                  <p v-if="profileErrors.nom" class="mt-1 text-sm text-red-600">
                    {{ profileErrors.nom }}
                  </p>
                </div>
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Adresse email *
                </label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  :class="{ 'border-red-500': profileErrors.email }"
                />
                <p v-if="profileErrors.email" class="mt-1 text-sm text-red-600">
                  {{ profileErrors.email }}
                </p>
              </div>

              <!-- Téléphone -->
              <div>
                <label for="telephone" class="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  id="telephone"
                  v-model="profileForm.telephone"
                  type="tel"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  :class="{ 'border-red-500': profileErrors.telephone }"
                  placeholder="+33 6 12 34 56 78"
                />
                <p v-if="profileErrors.telephone" class="mt-1 text-sm text-red-600">
                  {{ profileErrors.telephone }}
                </p>
              </div>

              <!-- Date de naissance -->
              <div>
                <label for="date_naissance" class="block text-sm font-medium text-gray-700">
                  Date de naissance
                </label>
                <input
                  id="date_naissance"
                  v-model="profileForm.date_naissance"
                  type="date"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <!-- Adresse -->
              <div>
                <label for="adresse" class="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <textarea
                  id="adresse"
                  v-model="profileForm.adresse"
                  rows="3"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Votre adresse complète"
                ></textarea>
              </div>

              <!-- Boutons -->
              <div class="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  @click="resetProfileForm"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  :disabled="isProfileLoading"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {{ isProfileLoading ? 'Sauvegarde...' : 'Sauvegarder' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Onglet Mot de passe -->
          <div v-if="activeTab === 'password'" class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Changer le mot de passe</h3>
              <p class="mt-1 text-sm text-gray-600">Assurez-vous d'utiliser un mot de passe sécurisé.</p>
            </div>
            
            <form @submit.prevent="changePassword" class="p-6 space-y-6">
              <!-- Mot de passe actuel -->
              <div>
                <label for="current_password" class="block text-sm font-medium text-gray-700">
                  Mot de passe actuel *
                </label>
                <input
                  id="current_password"
                  v-model="passwordForm.current_password"
                  type="password"
                  required
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  :class="{ 'border-red-500': passwordErrors.current_password }"
                />
                <p v-if="passwordErrors.current_password" class="mt-1 text-sm text-red-600">
                  {{ passwordErrors.current_password }}
                </p>
              </div>

              <!-- Nouveau mot de passe -->
              <div>
                <label for="new_password" class="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe *
                </label>
                <input
                  id="new_password"
                  v-model="passwordForm.new_password"
                  type="password"
                  required
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  :class="{ 'border-red-500': passwordErrors.new_password }"
                />
                <p v-if="passwordErrors.new_password" class="mt-1 text-sm text-red-600">
                  {{ passwordErrors.new_password }}
                </p>
              </div>

              <!-- Confirmation nouveau mot de passe -->
              <div>
                <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700">
                  Confirmer le nouveau mot de passe *
                </label>
                <input
                  id="new_password_confirmation"
                  v-model="passwordForm.new_password_confirmation"
                  type="password"
                  required
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  :class="{ 'border-red-500': passwordErrors.new_password_confirmation }"
                />
                <p v-if="passwordErrors.new_password_confirmation" class="mt-1 text-sm text-red-600">
                  {{ passwordErrors.new_password_confirmation }}
                </p>
              </div>

              <!-- Boutons -->
              <div class="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  @click="resetPasswordForm"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  :disabled="isPasswordLoading"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {{ isPasswordLoading ? 'Modification...' : 'Changer le mot de passe' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Onglet Préférences -->
          <div v-if="activeTab === 'preferences'" class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Préférences</h3>
              <p class="mt-1 text-sm text-gray-600">Gérez vos préférences de notification et de confidentialité.</p>
            </div>
            
            <form @submit.prevent="updatePreferences" class="p-6 space-y-6">
              <!-- Notifications -->
              <div>
                <h4 class="text-base font-medium text-gray-900 mb-4">Notifications</h4>
                <div class="space-y-4">
                  <div class="flex items-center">
                    <input
                      id="newsletter"
                      v-model="preferencesForm.newsletter"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label for="newsletter" class="ml-3 text-sm text-gray-700">
                      Recevoir la newsletter
                    </label>
                  </div>
                  
                  <div class="flex items-center">
                    <input
                      id="notifications_email"
                      v-model="preferencesForm.notifications_email"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label for="notifications_email" class="ml-3 text-sm text-gray-700">
                      Notifications par email
                    </label>
                  </div>
                  
                  <div class="flex items-center">
                    <input
                      id="notifications_sms"
                      v-model="preferencesForm.notifications_sms"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label for="notifications_sms" class="ml-3 text-sm text-gray-700">
                      Notifications par SMS
                    </label>
                  </div>
                </div>
              </div>

              <!-- Confidentialité -->
              <div class="border-t pt-6">
                <h4 class="text-base font-medium text-gray-900 mb-4">Confidentialité</h4>
                <div class="space-y-4">
                  <div class="flex items-center">
                    <input
                      id="profil_public"
                      v-model="preferencesForm.profil_public"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label for="profil_public" class="ml-3 text-sm text-gray-700">
                      Profil public (visible par les autres utilisateurs)
                    </label>
                  </div>
                </div>
              </div>

              <!-- Boutons -->
              <div class="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  @click="resetPreferencesForm"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  :disabled="isPreferencesLoading"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {{ isPreferencesLoading ? 'Sauvegarde...' : 'Sauvegarder' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Middleware d'authentification (à activer quand le middleware fonctionne)
// definePageMeta({
//   middleware: 'auth'
// })

const { user, logout } = useAuth()

// État des onglets
const activeTab = ref('profile')

// Messages d'état
const successMessage = ref('')
const errorMessage = ref('')

// États de chargement
const isProfileLoading = ref(false)
const isPasswordLoading = ref(false)
const isPreferencesLoading = ref(false)

// Formulaires
const profileForm = reactive({
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  date_naissance: '',
  adresse: ''
})

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const preferencesForm = reactive({
  newsletter: false,
  notifications_email: true,
  notifications_sms: false,
  profil_public: false
})

// Erreurs de validation
const profileErrors = reactive({})
const passwordErrors = reactive({})

// Initialiser les données du profil
onMounted(() => {
  if (user.value) {
    profileForm.prenom = user.value.prenom || ''
    profileForm.nom = user.value.nom || ''
    profileForm.email = user.value.email || ''
    profileForm.telephone = user.value.telephone || ''
    profileForm.date_naissance = user.value.date_naissance || ''
    profileForm.adresse = user.value.adresse || ''
    
    // Charger les préférences
    preferencesForm.newsletter = user.value.newsletter || false
    preferencesForm.notifications_email = user.value.notifications_email || true
    preferencesForm.notifications_sms = user.value.notifications_sms || false
    preferencesForm.profil_public = user.value.profil_public || false
  }
})

// Fonctions de mise à jour
const updateProfile = async () => {
  isProfileLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  // Reset des erreurs
  Object.keys(profileErrors).forEach(key => delete profileErrors[key])
  
  try {
    const API_BASE_URL = 'https://ressources-relationnelles-api-develop-xvsj0x.laravel.cloud/api'
    const token = useCookie('auth-token')
    
    const response = await $fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        prenom: profileForm.prenom,
        nom: profileForm.nom,
        email: profileForm.email,
        telephone: profileForm.telephone,
        date_naissance: profileForm.date_naissance,
        adresse: profileForm.adresse
      }
    })
    
    // Mettre à jour les données utilisateur
    if (user.value) {
      Object.assign(user.value, response.user)
    }
    
    successMessage.value = 'Profil mis à jour avec succès'
    
  } catch (error) {
    console.error('Erreur mise à jour profil:', error)
    
    if (error.status === 422) {
      const errors = error.data?.errors
      if (errors) {
        Object.assign(profileErrors, errors)
      }
      errorMessage.value = 'Veuillez corriger les erreurs dans le formulaire'
    } else {
      errorMessage.value = 'Erreur lors de la mise à jour du profil'
    }
  } finally {
    isProfileLoading.value = false
  }
}

const changePassword = async () => {
  isPasswordLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  // Reset des erreurs
  Object.keys(passwordErrors).forEach(key => delete passwordErrors[key])
  
  // Validation basique
  if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
    passwordErrors.new_password_confirmation = 'Les mots de passe ne correspondent pas'
    isPasswordLoading.value = false
    return
  }
  
  if (passwordForm.new_password.length < 8) {
    passwordErrors.new_password = 'Le mot de passe doit contenir au moins 8 caractères'
    isPasswordLoading.value = false
    return
  }
  
  try {
    const API_BASE_URL = 'https://ressources-relationnelles-api-develop-xvsj0x.laravel.cloud/api'
    const token = useCookie('auth-token')
    
    await $fetch(`${API_BASE_URL}/user/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.new_password_confirmation
      }
    })
    
    successMessage.value = 'Mot de passe modifié avec succès'
    resetPasswordForm()
    
  } catch (error) {
    console.error('Erreur changement mot de passe:', error)
    
    if (error.status === 422) {
      const errors = error.data?.errors
      if (errors) {
        Object.assign(passwordErrors, errors)
      }
      errorMessage.value = 'Veuillez corriger les erreurs dans le formulaire'
    } else if (error.status === 400) {
      errorMessage.value = 'Mot de passe actuel incorrect'
    } else {
      errorMessage.value = 'Erreur lors du changement de mot de passe'
    }
  } finally {
    isPasswordLoading.value = false
  }
}

const updatePreferences = async () => {
  isPreferencesLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const API_BASE_URL = 'https://ressources-relationnelles-api-develop-xvsj0x.laravel.cloud/api'
    const token = useCookie('auth-token')
    
    await $fetch(`${API_BASE_URL}/user/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        newsletter: preferencesForm.newsletter,
        notifications_email: preferencesForm.notifications_email,
        notifications_sms: preferencesForm.notifications_sms,
        profil_public: preferencesForm.profil_public
      }
    })
    
    successMessage.value = 'Préférences mises à jour avec succès'
    
  } catch (error) {
    console.error('Erreur mise à jour préférences:', error)
    errorMessage.value = 'Erreur lors de la mise à jour des préférences'
  } finally {
    isPreferencesLoading.value = false
  }
}

// Fonctions de reset
const resetProfileForm = () => {
  if (user.value) {
    profileForm.prenom = user.value.prenom || ''
    profileForm.nom = user.value.nom || ''
    profileForm.email = user.value.email || ''
    profileForm.telephone = user.value.telephone || ''
    profileForm.date_naissance = user.value.date_naissance || ''
    profileForm.adresse = user.value.adresse || ''
  }
  Object.keys(profileErrors).forEach(key => delete profileErrors[key])
}

const resetPasswordForm = () => {
  passwordForm.current_password = ''
  passwordForm.new_password = ''
  passwordForm.new_password_confirmation = ''
  Object.keys(passwordErrors).forEach(key => delete passwordErrors[key])
}

const resetPreferencesForm = () => {
  if (user.value) {
    preferencesForm.newsletter = user.value.newsletter || false
    preferencesForm.notifications_email = user.value.notifications_email || true
    preferencesForm.notifications_sms = user.value.notifications_sms || false
    preferencesForm.profil_public = user.value.profil_public || false
  }
}

// SEO
useSeoMeta({
  title: 'Gestion du compte',
  description: 'Gérez vos informations personnelles et préférences'
})
</script>