<!-- src/components/pages/Page2.svelte -->
<div class="page-container">
  <header>
    <h1>RESET·XR — Groups & Private Events</h1>
    <p class="subtitle">Celebrate your event with us!</p>
  </header>

  <section id="event-types">
    <h2>Event Types</h2>
    <ul>
      <li>Corporate Groups (Team-building, company parties)</li>
      <li>Children’s Birthdays</li>
      <li>Birthdays (all ages)</li>
      <li>Escape Rooms · Gaming · Experiences</li>
    </ul>
  </section>

  <section id="customise-event">
    <h2>Customise Your Event</h2>
    <p>Fill in the form and we’ll build the perfect session for you.</p>
    <form class="event-form">
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" name="nombre" />
      </div>
      <div class="form-group">
        <label for="email">Dirección Email</label>
        <input type="email" id="email" name="email" />
      </div>
      <div class="form-group">
        <label for="telefono">Teléfono</label>
        <input type="tel" id="telefono" name="telefono" />
      </div>
      <div class="form-group">
        <label for="codigo-postal">Código Postal</label>
        <input type="text" id="codigo-postal" name="codigo-postal" />
      </div>
      <div class="form-group">
        <label for="evento-descripcion">¡Explícanos tu evento!</label>
        <textarea id="evento-descripcion" name="evento-descripcion" rows="5"></textarea>
      </div>
      <button type="submit" class="submit-button">ENVIAR</button>
    </form>
  </section>

  <footer>
    <p>© RESET·XR Barcelona 2022 | 936 949 898</p>
  </footer>
</div>

<style>
  .page-container {
    font-family: sans-serif;
    color: #f0f0f0;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    background-color: transparent;
    border-radius: 8px;
  }

  header {
    text-align: center;
    border-bottom: 2px solid #555;
    padding-bottom: 20px;
    margin-bottom: 30px;
  }

  header h1 {
    color: #e6007e;
    font-size: 2.2em;
    margin: 0 0 10px 0;
  }

  .subtitle {
    font-size: 1.2em;
    color: #b0b0b0;
    margin: 0;
  }

  section {
    margin-bottom: 30px;
    padding: 25px;
    background-color: transparent;
    border-radius: 6px;
    border: 1px solid #444;
  }

  section h2 {
    font-size: 1.8em;
    color: #e6007e;
    margin-top: 0;
    margin-bottom: 20px;
  }

  section p, section ul {
    line-height: 1.6;
    margin-bottom: 15px;
    color: #dcdcdc;
  }

  #event-types ul {
    list-style: disc;
    padding-left: 25px;
  }

  #event-types ul li {
    margin-bottom: 8px;
  }

  .event-form .form-group {
    margin-bottom: 20px;
  }

  .event-form label {
    display: block;
    margin-bottom: 8px;
    color: #c0c0c0;
    font-weight: bold;
  }

  .event-form input[type="text"],
  .event-form input[type="email"],
  .event-form input[type="tel"],
  .event-form textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #555;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.05);
    color: #f0f0f0;
    font-size: 1em;
    box-sizing: border-box;
  }
  
  .event-form input[type="text"]:focus,
  .event-form input[type="email"]:focus,
  .event-form input[type="tel"]:focus,
  .event-form textarea:focus {
    outline: none;
    border-color: #e6007e;
    background-color: rgba(255, 255, 255, 0.08);
  }

  .event-form textarea {
    resize: vertical;
  }

  .submit-button {
    background-color: #e6007e;
    color: white;
    border: none;
    padding: 12px 25px;
    font-size: 1.1em;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: block;
    margin: 20px auto 0 auto;
  }

  .submit-button:hover {
    background-color: #bf0069;
  }

  footer {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #555;
    font-size: 0.9em;
    color: #aaa;
  }
</style>
