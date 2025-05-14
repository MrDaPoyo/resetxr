<div class="page-container">
  <header>
    <h1>RESET·XR – Virtual Reality Center</h1>
    <button class="book-now">Book now</button>
  </header>

  <nav class="main-nav">
    <h2>Main Sections</h2>
    <ul>
      <li><a href="#escape-rooms">Escape Rooms</a></li>
      <li><a href="#virtual-reality">Virtual Reality</a></li>
      <li><a href="#birthdays-parties">Birthdays & Parties</a></li>
      <li><a href="#team-building">Team Building</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="#gaming-bar">GamingBar</a></li>
    </ul>
  </nav>

  <section id="top-sellers">
    <h2>Top Sellers</h2>
    <p>Here you’ll find our best-selling experiences: the most vibrant, fail-proof adventures. Don’t hesitate—jump in and enjoy!</p>
  </section>

  <section id="escape-rooms">
    <h2>Escape Rooms</h2>
    <p>Whether you already love traditional escape rooms or are just curious, Virtual Reality escape rooms take the challenge to the next level. Start the adventure!</p>
  </section>

  <section id="gaming">
    <h2>Gaming</h2>
    <p>Shooters, adventure, exploration, sports, simulation, whatever you like, we have the best collection. If gaming is your thing, this is your section.</p>
  </section>

  <section id="top-kids-games">
    <h2>Top Kids Games</h2>
    <p>Discover the most fun and exciting experiences for children. This selection guarantees the right choice every time.</p>
  </section>

  <section id="exploration">
    <h2>Exploration</h2>
    <p>Uncover thrilling adventures. Our exploration experiences transport you to incredible, magical places. Dare yourself!</p>
  </section>

  <section id="educational">
    <h2>Educational</h2>
    <p>Who said learning is boring? In virtual reality it’s the best way to discover a new dimension, for adults and kids alike. We’ll be waiting for you!</p>
  </section>

  <section id="contact-location">
    <h2>Contact & Location</h2>
    <address>
      Carrer de la Muntanya 18<br />
      08026 Barcelona
    </address>
    <p>WhatsApp: +34 697 95 06 69</p>
    <p>Phone: +34 691 02 12 19</p>
  </section>

  <section id="opening-hours">
    <h2>Virtual Reality Opening Hours</h2>
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Hours*</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Monday</td>
          <td>Closed (customer service only)</td>
        </tr>
        <tr>
          <td>Tuesday</td>
          <td>Closed (customer service only)</td>
        </tr>
        <tr>
          <td>Wednesday</td>
          <td>10:30-14:30 (1*) / 17:00-22:30</td>
        </tr>
        <tr>
          <td>Thursday</td>
          <td>10:30-14:30 (1*) / 17:00-22:30</td>
        </tr>
        <tr>
          <td>Friday</td>
          <td>10:30-14:30 (2*) / 17:00-23:00</td>
        </tr>
        <tr>
          <td>Saturday</td>
          <td>10:30-23:00</td>
        </tr>
        <tr>
          <td>Sunday</td>
          <td>10:30-22:30</td>
        </tr>
      </tbody>
    </table>
    <p class="notes">
      (1*) Open exclusively for corporate events<br />
      (2*) Open exclusively for pre-booked sessions
    </p>
  </section>

  <footer>
    <p>© RESET·XR Barcelona 2022 | 936 949 898</p>
  </footer>
</div>

<style>
  .page-container {
    font-family: sans-serif;
    color: #f0f0f0; /* Changed from #333 for dark background */
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    background-color: transparent; /* Removed white background */
    border-radius: 8px;
    /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */ /* Optional: remove or adjust shadow for dark bg */
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #555; /* Adjusted border for dark bg */
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  header h1 {
    color: #e6007e; /* RESET XR Pink - should be visible on dark */
    font-size: 2em;
    margin: 0;
  }

  .book-now {
    background-color: #e6007e; /* RESET XR Pink */
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1em;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .book-now:hover {
    background-color: #bf0069; /* Darker Pink */
  }

  .main-nav {
    margin-bottom: 30px;
  }

  .main-nav h2 {
    font-size: 1.5em;
    color: #f0f0f0; /* Changed from #333 for dark background */
    margin-bottom: 10px;
  }

  .main-nav ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .main-nav ul li a {
    text-decoration: none;
    color: #87cefa; /* Lighter Blue link for dark bg */
    padding: 8px 12px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent light bg for links */
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .main-nav ul li a:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  section {
    margin-bottom: 30px;
    padding: 20px;
    background-color: transparent; /* Removed white background */
    border-radius: 6px;
    /* box-shadow: 0 0 5px rgba(0,0,0,0.05); */ /* Optional: remove or adjust shadow */
    border: 1px solid #444; /* Added subtle border for sections on dark bg */
  }

  section h2 {
    font-size: 1.8em;
    color: #e6007e; /* RESET XR Pink - should be visible */
    margin-top: 0;
    margin-bottom: 15px;
  }
  
  section p, section address {
    line-height: 1.6;
    margin-bottom: 10px;
    color: #dcdcdc; /* Lighter gray for paragraph text */
  }

  #contact-location address {
    font-style: normal;
  }

  #opening-hours table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
  }

  #opening-hours th, #opening-hours td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #555; /* Adjusted border for dark bg */
  }

  #opening-hours th {
    background-color: rgba(255, 255, 255, 0.05); /* Darker, semi-transparent bg for headers */
    color: #f0f0f0; /* Changed from #333 */
  }

  #opening-hours td:first-child {
    font-weight: bold;
    color: #e0e0e0; /* Lighter color for day names */
  }
  
  .notes {
    font-size: 0.9em;
    color: #aaa; /* Adjusted for dark bg */
    margin-top: 10px;
  }

  footer {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #555; /* Adjusted border for dark bg */
    font-size: 0.9em;
    color: #aaa; /* Adjusted for dark bg */
  }
</style>
