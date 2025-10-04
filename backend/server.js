const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production'

// Configuration CORS pour autoriser les requêtes depuis le frontend
const corsOptions = {
  origin: [
    'https://bnp-paribas-alpha.vercel.app',
    'http://localhost:3000', // Pour le développement local
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Middleware de vérification JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Token d\'accès requis' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide' })
  }
}

// Middleware de vérification admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès administrateur requis' })
  }
  next()
}

// Connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bnp-paribas'

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connexion MongoDB réussie')
})
.catch((error) => {
  console.error('❌ Erreur de connexion MongoDB:', error)
})

// Modèle User
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  fraisDeblocage: {
    type: Number,
    required: true,
    default: 0
  },
  solde: {
    type: Number,
    required: true,
    default: 0
  },
  codeSecret: {
    type: String,
    required: true,
    unique: true,
    length: 4
  },
  dateDebut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateFin: {
    type: Date,
    required: true
  },
  dureeMois: {
    type: Number,
    required: true,
    default: 12
  },
  suspendu: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)

// Routes API

// POST /api/auth/login - Connexion admin
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    // Vérification des identifiants admin
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { 
          username, 
          role: 'admin',
          iat: Math.floor(Date.now() / 1000)
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      )
      
      res.status(200).json({
        success: true,
        token,
        user: { username, role: 'admin' }
      })
    } else {
      res.status(401).json({ error: 'Identifiants incorrects' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' })
  }
})

// POST /api/auth/verify - Vérifier le token
app.post('/api/auth/verify', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  })
})

// GET /api/users - Récupérer tous les utilisateurs (PROTÉGÉ ADMIN)
app.get('/api/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' })
  }
})

// POST /api/users - Créer un nouvel utilisateur (PROTÉGÉ ADMIN)
app.post('/api/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { nom, fraisDeblocage, solde, codeSecret, dureeMois } = req.body
    
    // Vérifier si le code secret existe déjà
    const existingUser = await User.findOne({ codeSecret })
    if (existingUser) {
      return res.status(400).json({ error: 'Ce code secret existe déjà' })
    }

    // Calculer la date de fin basée sur la durée en mois
    const dateDebut = new Date()
    const dateFin = new Date()
    dateFin.setMonth(dateFin.getMonth() + (dureeMois || 12))

    const user = new User({
      nom,
      fraisDeblocage: Number(fraisDeblocage),
      solde: Number(solde),
      codeSecret,
      dateDebut,
      dateFin,
      dureeMois: Number(dureeMois) || 12
    })

    await user.save()
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' })
  }
})

// PUT /api/users/:id - Modifier un utilisateur (PROTÉGÉ ADMIN)
app.put('/api/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { nom, fraisDeblocage, solde, codeSecret } = req.body
    
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    // Vérifier si le code secret existe déjà (sauf pour l'utilisateur actuel)
    if (codeSecret !== user.codeSecret) {
      const existingUser = await User.findOne({ codeSecret, _id: { $ne: id } })
      if (existingUser) {
        return res.status(400).json({ error: 'Ce code secret existe déjà' })
      }
    }

    // Mettre à jour l'utilisateur
    user.nom = nom
    user.fraisDeblocage = Number(fraisDeblocage)
    user.solde = Number(solde)
    user.codeSecret = codeSecret
    await user.save()

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la modification de l\'utilisateur' })
  }
})

// PUT /api/users/:id/renew - Renouveler un utilisateur (PROTÉGÉ ADMIN)
app.put('/api/users/:id/renew', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { dureeMois } = req.body
    
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    // Calculer la nouvelle date de fin
    const nouvelleDateFin = new Date()
    nouvelleDateFin.setMonth(nouvelleDateFin.getMonth() + (dureeMois || user.dureeMois))

    // Mettre à jour l'utilisateur
    user.dateFin = nouvelleDateFin
    user.dureeMois = dureeMois || user.dureeMois
    await user.save()

    res.status(200).json({ 
      message: 'Utilisateur renouvelé avec succès',
      user 
    })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du renouvellement de l\'utilisateur' })
  }
})

// DELETE /api/users/:id - Supprimer un utilisateur (PROTÉGÉ ADMIN)
app.delete('/api/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' })
  }
})

// PUT /api/users/:id/suspend - Suspendre/Réactiver un utilisateur (PROTÉGÉ ADMIN)
app.put('/api/users/:id/suspend', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { suspendu } = req.body
    
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    user.suspendu = suspendu
    await user.save()

    res.status(200).json({ 
      message: suspendu ? 'Utilisateur suspendu avec succès' : 'Utilisateur réactivé avec succès',
      user 
    })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suspension/réactivation de l\'utilisateur' })
  }
})

// GET /api/user-by-code/:code - Récupérer un utilisateur par code secret
app.get('/api/user-by-code/:code', async (req, res) => {
  try {
    const { code } = req.params

    const user = await User.findOne({ codeSecret: code })

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }

    // Vérifier si le compte est suspendu
    if (user.suspendu) {
      return res.status(403).json({ error: 'Votre compte a été suspendu. Contactez votre conseiller.' })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' })
  }
})

// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Backend BNP PARIBAS fonctionne !',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connecté' : 'Déconnecté'
  })
})

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`)
 
})

module.exports = app
