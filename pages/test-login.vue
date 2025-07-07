<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4">
    <div class="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-6 text-center">Test API Login</h1>
      
      <!-- Formulaire de test -->
      <form @submit.prevent="testLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="test@example.com"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="password"
          />
        </div>
        
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          {{ isLoading ? 'Test en cours...' : 'Tester Login' }}
        </button>
      </form>
      
      <!-- Résultats -->
      <div v-if="result" class="mt-6 p-4 rounded-md" :class="result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
        <h3 class="font-medium" :class="result.success ? 'text-green-800' : 'text-red-800'">
          {{ result.success ? 'Succès ✅' : 'Erreur ❌' }}
        </h3>
        <pre class="mt-2 text-sm" :class="result.success ? 'text-green-700' : 'text-red-700'">{{ JSON.stringify(result.data, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref('test@example.com')
const password = ref('password123')
const isLoading = ref(false)
const result = ref(null)

const testLogin = async () => {
  isLoading.value = true
  result.value = null
  
  try {
    console.log('🔄 Test de login avec l\'API...')
    
    const response = await $fetch('https://ressources-relationnelles-api-develop-xvsj0x.laravel.cloud/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    console.log('✅ Succès:', response)
    result.value = {
      success: true,
      data: response
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error)
    result.value = {
      success: false,
      data: {
        status: error.status || 'Unknown',
        message: error.data?.message || error.message || 'Erreur inconnue',
        details: error.data || error
      }
    }
  } finally {
    isLoading.value = false
  }
}
</script>