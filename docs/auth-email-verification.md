# Vérification de la configuration Auth

- Projet Supabase : Call of chess, production, ref `uefeyfyzfoegjkuddnvx`.
- Avant correction, la **Site URL** était `http://localhost:3000`.
- La **Site URL** a été remplacée par `https://www.callofchess.online` et Supabase a confirmé : « Successfully updated site URL ».
- Une URL de redirection autorisée `https://www.callofchess.online` a été ajoutée et enregistrée.
- La page des modèles d’e-mail indique que l’édition du sujet et du corps nécessite d’abord la configuration d’un SMTP personnalisé. Le modèle par défaut Supabase est donc encore actif ; l’identité d’expéditeur ne peut pas devenir « Call of Chess » avec le relais SMTP par défaut.
- Prochaine action nécessaire : disposer d’un fournisseur SMTP et d’une adresse d’envoi vérifiée (par exemple `noreply@callofchess.vercel.app` ou un domaine de marque). Ne jamais inscrire de mot de passe SMTP dans le dépôt.
