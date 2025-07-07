// composables/useAuth.js
export const useAuth = () => {
  // Utilisateurs hardcodés (simulation backend)
  const MOCK_USERS = [
    {
      id: 1,
      prenom: "Jean",
      nom: "Dupont",
      email: "user@exemple.com",
      password: "password123",
      telephone: "0123456789",
      role: "user",
      status: "active", // active, inactive, suspended
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=jean&backgroundColor=b6e3f4",
      created_at: new Date('2024-01-15'),
      bio: "Utilisateur passionné par le networking et les relations professionnelles",
      location: "Paris, France",
      last_login: new Date('2024-01-20'),
      posts_count: 15,
      connections_count: 42
    },
    {
      id: 2,
      prenom: "Admin",
      nom: "Système",
      email: "admin@exemple.com", 
      password: "admin123",
      telephone: "0123456788",
      role: "admin",
      status: "active",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=fbb6ce",
      created_at: new Date('2024-01-01'),
      bio: "Administrateur de la plateforme Ressources Relationnelles",
      location: "Paris, France",
      last_login: new Date(),
      posts_count: 8,
      connections_count: 25
    },
    {
      id: 3,
      prenom: "Marie",
      nom: "Dubois",
      email: "marie.dubois@exemple.com",
      password: "marie123",
      telephone: "0123456790",
      role: "user",
      status: "active",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=marie&backgroundColor=c6f6d5",
      created_at: new Date('2024-01-10'),
      bio: "Experte en communication digitale",
      location: "Lyon, France",
      last_login: new Date('2024-01-19'),
      posts_count: 23,
      connections_count: 67
    },
    {
      id: 4,
      prenom: "Pierre",
      nom: "Martin",
      email: "pierre.martin@exemple.com",
      password: "pierre123",
      telephone: "0123456791",
      role: "user",
      status: "inactive",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=pierre&backgroundColor=fde68a",
      created_at: new Date('2024-01-05'),
      bio: "Développeur passionné",
      location: "Marseille, France",
      last_login: new Date('2024-01-18'),
      posts_count: 8,
      connections_count: 19
    },
    {
      id: 5,
      prenom: "Sophie",
      nom: "Leroy",
      email: "sophie.leroy@exemple.com",
      password: "sophie123",
      telephone: "0123456792",
      role: "user",
      status: "suspended",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophie&backgroundColor=c4b5fd",
      created_at: new Date('2024-01-08'),
      bio: "Community manager créative",
      location: "Toulouse, France",
      last_login: new Date('2024-01-17'),
      posts_count: 31,
      connections_count: 89
    }
  ]

  // État réactif de l'utilisateur
  const user = useState('auth.user', () => null)
  const isLoggedIn = computed(() => !!user.value)
  const isLoading = useState('auth.loading', () => false)

  // Token simulé
  const token = useCookie('auth-token', {
    default: () => null,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30 // 30 jours
  })

  // Fonction utilitaire pour générer un token simulé
  const generateMockToken = (userId) => {
    return `mock-token-${userId}-${Date.now()}`
  }

  // Fonction utilitaire pour valider un token simulé
  const validateMockToken = (tokenValue) => {
    if (!tokenValue || !tokenValue.startsWith('mock-token-')) {
      return null
    }
    
    const parts = tokenValue.split('-')
    if (parts.length !== 4) return null
    
    const userId = parseInt(parts[2])
    return MOCK_USERS.find(u => u.id === userId) || null
  }

  // Fonction d'inscription (simulation)
  const register = async (userData) => {
    isLoading.value = true
    
    // Simuler le délai d'une requête
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      // Vérifier si l'email existe déjà
      const existingUser = MOCK_USERS.find(u => u.email === userData.email)
      if (existingUser) {
        return {
          success: false,
          message: 'Cette adresse email est déjà utilisée'
        }
      }

      // Validation simple
      if (userData.password !== userData.confirmPassword) {
        return {
          success: false,
          message: 'Les mots de passe ne correspondent pas'
        }
      }

      if (userData.password.length < 6) {
        return {
          success: false,
          message: 'Le mot de passe doit contenir au moins 6 caractères'
        }
      }

      // Créer un nouvel utilisateur
      const newUser = {
        id: MOCK_USERS.length + 1,
        prenom: userData.prenom,
        nom: userData.nom,
        email: userData.email,
        telephone: userData.telephone,
        role: 'user',
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.prenom}&backgroundColor=c6f6d5`,
        created_at: new Date(),
        bio: "",
        location: ""
      }

      // Ajouter à notre "base de données" simulée
      MOCK_USERS.push(newUser)
      
      // Connecter automatiquement
      const userToReturn = { ...newUser }
      delete userToReturn.password // Ne pas retourner le mot de passe
      
      user.value = userToReturn
      token.value = generateMockToken(newUser.id)
      
      // Stocker en localStorage pour persistance
      if (process.client) {
        localStorage.setItem('mock-users', JSON.stringify(MOCK_USERS))
        localStorage.setItem('current-user', JSON.stringify(userToReturn))
      }
      
      return {
        success: true,
        data: { user: userToReturn, token: token.value },
        message: 'Compte créé avec succès'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Une erreur est survenue lors de l\'inscription'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Fonction de connexion (simulation)
  const login = async (credentials) => {
    isLoading.value = true
    
    // Simuler le délai d'une requête
    await new Promise(resolve => setTimeout(resolve, 800))
    
    try {
      // Charger les utilisateurs depuis localStorage s'ils existent
      let users = MOCK_USERS
      if (process.client) {
        const storedUsers = localStorage.getItem('mock-users')
        if (storedUsers) {
          users = [...MOCK_USERS, ...JSON.parse(storedUsers).filter(u => !MOCK_USERS.find(mu => mu.id === u.id))]
        }
      }

      // Trouver l'utilisateur
      const foundUser = users.find(u => 
        u.email === credentials.email && u.password === credentials.password
      )
      
      if (!foundUser) {
        return {
          success: false,
          message: 'Email ou mot de passe incorrect'
        }
      }

      // Vérifier le statut du compte
      if (foundUser.status === 'inactive') {
        return {
          success: false,
          message: 'Votre compte a été désactivé. Contactez l\'administrateur.'
        }
      }

      if (foundUser.status === 'suspended') {
        return {
          success: false,
          message: 'Votre compte a été suspendu pour violation des conditions d\'utilisation.'
        }
      }
      
      // Créer l'objet utilisateur sans le mot de passe
      const userToReturn = { ...foundUser }
      delete userToReturn.password
      
      // Stocker l'utilisateur et le token
      user.value = userToReturn
      token.value = generateMockToken(foundUser.id)
      
      // Stocker en localStorage pour persistance
      if (process.client) {
        localStorage.setItem('current-user', JSON.stringify(userToReturn))
      }
      
      return {
        success: true,
        data: { user: userToReturn, token: token.value },
        message: 'Connexion réussie'
      }
    } catch (error) {
      console.error('Erreur lors de la connexion simulée:', error)
      return {
        success: false,
        message: 'Une erreur est survenue lors de la connexion'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Fonction de déconnexion
  const logout = async () => {
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Nettoyer l'état local
      user.value = null
      token.value = null
      
      // Nettoyer localStorage
      if (process.client) {
        localStorage.removeItem('current-user')
      }
      
      await navigateTo('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  // Fonction pour récupérer l'utilisateur actuel
  const fetchUser = async () => {
    if (!token.value) {
      return null
    }
    
    try {
      // Valider le token
      const foundUser = validateMockToken(token.value)
      if (!foundUser) {
        throw new Error('Token invalide')
      }
      
      // Retourner l'utilisateur sans le mot de passe
      const userToReturn = { ...foundUser }
      delete userToReturn.password
      
      user.value = userToReturn
      return userToReturn
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      
      // Token invalide, nettoyer
      user.value = null
      token.value = null
      
      if (process.client) {
        localStorage.removeItem('current-user')
      }
      
      return null
    }
  }

  // Initialiser l'authentification
  const initAuth = async () => {
    if (process.client) {
      // Essayer de restaurer depuis localStorage
      const storedUser = localStorage.getItem('current-user')
      if (storedUser && token.value) {
        try {
          user.value = JSON.parse(storedUser)
        } catch (e) {
          localStorage.removeItem('current-user')
        }
      } else if (token.value && !user.value) {
        await fetchUser()
      }
    }
  }

  // Fonctions pour les relations (simulation)
  const fetchRelations = async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Relations mockées
    const mockRelations = [
      {
        id: 1,
        prenom: "Marie",
        nom: "Dubois", 
        email: "marie.dubois@exemple.com",
        type: "collègue",
        entreprise: "TechCorp",
        notes: "Excellente collaboration sur le projet X"
      },
      {
        id: 2,
        prenom: "Pierre",
        nom: "Martin",
        email: "pierre.martin@exemple.com", 
        type: "mentor",
        entreprise: "StartupHub",
        notes: "Mentor très inspirant"
      }
    ]
    
    return {
      success: true,
      data: mockRelations
    }
  }

  const addRelation = async (relationData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      data: { id: Date.now(), ...relationData },
      message: 'Relation ajoutée avec succès'
    }
  }

  const deleteRelation = async (relationId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      success: true,
      message: 'Relation supprimée avec succès'
    }
  }

  // Fonctions d'administration (admin seulement)
  const getAllUsers = async () => {
    // Vérifier que l'utilisateur est admin
    if (!user.value || user.value.role !== 'admin') {
      return {
        success: false,
        message: 'Accès non autorisé'
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Charger tous les utilisateurs (y compris ceux du localStorage)
    let allUsers = [...MOCK_USERS]
    if (process.client) {
      const storedUsers = localStorage.getItem('mock-users')
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        // Fusionner en évitant les doublons
        parsedUsers.forEach(storedUser => {
          if (!allUsers.find(u => u.id === storedUser.id)) {
            allUsers.push(storedUser)
          }
        })
      }
    }

    // Retourner sans les mots de passe
    const usersWithoutPasswords = allUsers.map(u => {
      const { password, ...userWithoutPassword } = u
      return userWithoutPassword
    })
    
    return {
      success: true,
      data: usersWithoutPasswords
    }
  }

  const updateUserStatus = async (userId, newStatus) => {
    // Vérifier que l'utilisateur est admin
    if (!user.value || user.value.role !== 'admin') {
      return {
        success: false,
        message: 'Accès non autorisé'
      }
    }

    // Valider le statut
    if (!['active', 'inactive', 'suspended'].includes(newStatus)) {
      return {
        success: false,
        message: 'Statut invalide'
      }
    }

    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      // Trouver l'utilisateur dans MOCK_USERS
      let userFound = false
      const userIndex = MOCK_USERS.findIndex(u => u.id === userId)
      
      if (userIndex !== -1) {
        MOCK_USERS[userIndex].status = newStatus
        userFound = true
      }

      // Chercher aussi dans localStorage
      if (process.client) {
        const storedUsers = localStorage.getItem('mock-users')
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers)
          const storedUserIndex = parsedUsers.findIndex(u => u.id === userId)
          
          if (storedUserIndex !== -1) {
            parsedUsers[storedUserIndex].status = newStatus
            localStorage.setItem('mock-users', JSON.stringify(parsedUsers))
            userFound = true
          }
        }
      }

      if (!userFound) {
        return {
          success: false,
          message: 'Utilisateur non trouvé'
        }
      }

      const statusLabels = {
        active: 'activé',
        inactive: 'désactivé', 
        suspended: 'suspendu'
      }

      return {
        success: true,
        message: `Compte ${statusLabels[newStatus]} avec succès`,
        data: { userId, status: newStatus }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la mise à jour du statut'
      }
    }
  }

  const getUserStats = async () => {
    // Vérifier que l'utilisateur est admin
    if (!user.value || user.value.role !== 'admin') {
      return {
        success: false,
        message: 'Accès non autorisé'
      }
    }

    await new Promise(resolve => setTimeout(resolve, 300))

    // Récupérer tous les utilisateurs
    const allUsersResult = await getAllUsers()
    if (!allUsersResult.success) {
      return allUsersResult
    }

    const allUsers = allUsersResult.data
    
    const stats = {
      total: allUsers.length,
      active: allUsers.filter(u => u.status === 'active').length,
      inactive: allUsers.filter(u => u.status === 'inactive').length,
      suspended: allUsers.filter(u => u.status === 'suspended').length,
      admins: allUsers.filter(u => u.role === 'admin').length,
      users: allUsers.filter(u => u.role === 'user').length,
      newThisWeek: allUsers.filter(u => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return new Date(u.created_at) > weekAgo
      }).length
    }

    return {
      success: true,
      data: stats
    }
  }

  // Ressources mockées pour la modération
  const MOCK_RESOURCES = [
    {
      id: 1,
      title: "Conférence sur le Leadership Digital",
      description: "Une conférence exceptionnelle sur les nouvelles approches du leadership à l'ère numérique.",
      category: 'formation',
      resourceType: 'evenement',
      author: "Marie Dubois",
      authorId: 3,
      status: 'approved', // draft, pending, approved, rejected
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      moderatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      moderatedBy: 2,
      moderationNote: "",
      likes: 45,
      image: "https://picsum.photos/400/200?random=1",
      tags: ['leadership', 'digital', 'management']
    },
    {
      id: 2,
      title: "Guide complet du Networking efficace",
      description: "Apprenez les meilleures techniques pour développer votre réseau professionnel de manière authentique.",
      category: 'networking',
      resourceType: 'article',
      author: "Pierre Martin",
      authorId: 4,
      status: 'pending',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      moderatedAt: null,
      moderatedBy: null,
      moderationNote: "",
      likes: 0,
      image: "https://picsum.photos/400/200?random=2",
      tags: ['networking', 'relations', 'professionnel']
    },
    {
      id: 3,
      title: "Formation: Gestion du Stress et Bien-être",
      description: "Formation complète pour apprendre à gérer son stress et améliorer son bien-être au travail.",
      category: 'sante',
      resourceType: 'formation',
      author: "Sophie Leroy",
      authorId: 5,
      status: 'rejected',
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      moderatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      moderatedBy: 2,
      moderationNote: "Contenu non conforme aux guidelines - manque de sources fiables",
      likes: 0,
      image: "https://picsum.photos/400/200?random=3",
      tags: ['stress', 'bien-être', 'santé']
    },
    {
      id: 4,
      title: "Nouveau livre sur l'Intelligence Émotionnelle",
      description: "Un ouvrage révolutionnaire sur le développement de l'intelligence émotionnelle en entreprise.",
      category: 'education',
      resourceType: 'livre',
      author: "Jean Dupont",
      authorId: 1,
      status: 'pending',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      moderatedAt: null,
      moderatedBy: null,
      moderationNote: "",
      likes: 0,
      image: "https://picsum.photos/400/200?random=4",
      tags: ['intelligence émotionnelle', 'développement', 'entreprise']
    },
    {
      id: 5,
      title: "Outil de productivité révolutionnaire",
      description: "Découvrez cette nouvelle application qui va transformer votre façon de travailler.",
      category: 'technologie',
      resourceType: 'outil',
      author: "Marie Dubois",
      authorId: 3,
      status: 'draft',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      moderatedAt: null,
      moderatedBy: null,
      moderationNote: "",
      likes: 0,
      image: "https://picsum.photos/400/200?random=5",
      tags: ['productivité', 'outil', 'technologie']
    }
  ]

  // Fonctions de gestion des ressources (admin/modération)
  const getAllResources = async (includeAll = false) => {
    // Vérifier que l'utilisateur est admin pour voir toutes les ressources
    if (includeAll && (!user.value || user.value.role !== 'admin')) {
      return {
        success: false,
        message: 'Accès non autorisé'
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Charger toutes les ressources (y compris celles du localStorage)
    let allResources = [...MOCK_RESOURCES]
    if (process.client) {
      const storedResources = localStorage.getItem('mock-resources')
      if (storedResources) {
        const parsedResources = JSON.parse(storedResources)
        // Fusionner en évitant les doublons
        parsedResources.forEach(storedResource => {
          if (!allResources.find(r => r.id === storedResource.id)) {
            allResources.push(storedResource)
          }
        })
      }
    }

    // Si pas admin, ne retourner que les ressources approuvées
    if (!includeAll) {
      allResources = allResources.filter(r => r.status === 'approved')
    }
    
    return {
      success: true,
      data: allResources
    }
  }

  const moderateResource = async (resourceId, action, moderationNote = '') => {
    // Vérifier que l'utilisateur est admin
    if (!user.value || user.value.role !== 'admin') {
      return {
        success: false,
        message: 'Accès non autorisé'
      }
    }

    // Valider l'action
    if (!['approve', 'reject'].includes(action)) {
      return {
        success: false,
        message: 'Action invalide'
      }
    }

    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      // Trouver la ressource dans MOCK_RESOURCES
      let resourceFound = false
      const resourceIndex = MOCK_RESOURCES.findIndex(r => r.id === resourceId)
      
      if (resourceIndex !== -1) {
        const newStatus = action === 'approve' ? 'approved' : 'rejected'
        MOCK_RESOURCES[resourceIndex].status = newStatus
        MOCK_RESOURCES[resourceIndex].moderatedAt = new Date()
        MOCK_RESOURCES[resourceIndex].moderatedBy = user.value.id
        MOCK_RESOURCES[resourceIndex].moderationNote = moderationNote
        resourceFound = true
      }

      // Chercher aussi dans localStorage
      if (process.client) {
        const storedResources = localStorage.getItem('mock-resources')
        if (storedResources) {
          const parsedResources = JSON.parse(storedResources)
          const storedResourceIndex = parsedResources.findIndex(r => r.id === resourceId)
          
          if (storedResourceIndex !== -1) {
            const newStatus = action === 'approve' ? 'approved' : 'rejected'
            parsedResources[storedResourceIndex].status = newStatus
            parsedResources[storedResourceIndex].moderatedAt = new Date()
            parsedResources[storedResourceIndex].moderatedBy = user.value.id
            parsedResources[storedResourceIndex].moderationNote = moderationNote
            localStorage.setItem('mock-resources', JSON.stringify(parsedResources))
            resourceFound = true
          }
        }
      }

      if (!resourceFound) {
        return {
          success: false,
          message: 'Ressource non trouvée'
        }
      }

      const actionLabels = {
        approve: 'approuvée',
        reject: 'rejetée'
      }

      return {
        success: true,
        message: `Ressource ${actionLabels[action]} avec succès`,
        data: { resourceId, status: action === 'approve' ? 'approved' : 'rejected' }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la modération de la ressource'
      }
    }
  }

  const getModerationStats = async () => {
    // Vérifier que l'utilisateur est admin
    if (!user.value || user.value.role !== 'admin') {
      return {
        success: false,
        message: 'Accès non autorisé'
      }
    }

    await new Promise(resolve => setTimeout(resolve, 300))

    // Récupérer toutes les ressources
    const allResourcesResult = await getAllResources(true)
    if (!allResourcesResult.success) {
      return allResourcesResult
    }

    const allResources = allResourcesResult.data
    
    const stats = {
      total: allResources.length,
      pending: allResources.filter(r => r.status === 'pending').length,
      approved: allResources.filter(r => r.status === 'approved').length,
      rejected: allResources.filter(r => r.status === 'rejected').length,
      draft: allResources.filter(r => r.status === 'draft').length,
      pendingThisWeek: allResources.filter(r => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return r.status === 'pending' && new Date(r.submittedAt) > weekAgo
      }).length
    }

    return {
      success: true,
      data: stats
    }
  }

  const submitResource = async (resourceData) => {
    if (!user.value) {
      return {
        success: false,
        message: 'Vous devez être connecté pour soumettre une ressource'
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const newResource = {
        id: Date.now(),
        ...resourceData,
        authorId: user.value.id,
        author: `${user.value.prenom} ${user.value.nom}`,
        status: 'pending',
        submittedAt: new Date(),
        moderatedAt: null,
        moderatedBy: null,
        moderationNote: '',
        likes: 0
      }

      // Ajouter à notre "base de données" simulée
      MOCK_RESOURCES.push(newResource)
      
      // Stocker en localStorage pour persistance
      if (process.client) {
        const existingResources = localStorage.getItem('mock-resources')
        let resources = existingResources ? JSON.parse(existingResources) : []
        resources.push(newResource)
        localStorage.setItem('mock-resources', JSON.stringify(resources))
      }
      
      return {
        success: true,
        data: newResource,
        message: 'Ressource soumise avec succès pour modération'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la soumission de la ressource'
      }
    }
  }

  return {
    // État
    user: readonly(user),
    isLoggedIn,
    isLoading: readonly(isLoading),
    
    // Actions
    register,
    login,
    logout,
    fetchUser,
    initAuth,
    
    // Relations
    fetchRelations,
    addRelation,
    deleteRelation,

    // Administration
    getAllUsers,
    updateUserStatus,
    getUserStats,

    // Ressources et modération
    getAllResources,
    moderateResource,
    getModerationStats,
    submitResource
  }
}