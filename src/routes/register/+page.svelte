<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  let username = '';
  let password = '';
  let confirmPassword = '';
  let errorMessage = '';
  let isSubmitting = false;

  async function handleSubmit() {
    isSubmitting = true;
    errorMessage = '';

    // Validation basique des champs
    if (!username || !password || !confirmPassword) {
      errorMessage = 'Tous les champs sont requis';
      isSubmitting = false;
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = 'Les mots de passe ne correspondent pas';
      isSubmitting = false;
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, confirmPwd: password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        errorMessage = data.error || 'Une erreur est survenue lors de l\'inscription';
      } else {
        // On redirige vers la page d'accueil après l'inscription réussie
        goto('/');
      }
    } catch (error) {
      errorMessage = 'Une erreur est survenue lors de l\'inscription';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<main>
  <h1>Inscription</h1>
  
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="username">Nom d'utilisateur</label>
      <input type="text" id="username" bind:value={username} required />
    </div>
    
    <div>
      <label for="password">Mot de passe</label>
      <input type="password" id="password" bind:value={password} required />
    </div>

    <div>
      <label for="confirmPassword">Confirmer le mot de passe</label>
      <input type="password" id="confirmPassword" bind:value={confirmPassword} required />
    </div>

    <button type="submit" disabled={isSubmitting}>S'inscrire</button>
  </form>

  {#if isSubmitting}
    <p>En cours d'inscription...</p>
  {/if}
</main>

<style>
  .error {
    color: red;
  }
  form {
    max-width: 400px;
    margin: auto;
  }
  input {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
  }
  button {
    width: 100%;
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
  }
  button:disabled {
    background-color: #ccc;
  }
</style>
