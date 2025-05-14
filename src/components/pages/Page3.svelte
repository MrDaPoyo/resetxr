<script>
// Page3.svelte - Game List

const games = [
  {
    title: "After The Fall",
    tags: ["TOP SELLER!"],
    players: "1 to 4",
    description: "Action shooter in VR set in a post-apocalyptic world full of cold-twisted mutant undead. Explore the ruins of 1980s Los Angeles, wield deadly weapons and devastating powers with real-world motions to craft your own combat style. Team up with up to four players and fight to survive while upgrading your skills and gear. Face hordes and bosses to make the city better than the one your predecessors abandoned.",
    duration: "50 mins",
    price: "€26.00",
    seats: "1 seat"
  },
  {
    title: "F1 23",
    tags: ["NEW!", "GET 15 % OFF WITH CODE F1RX23"],
    players: "1 Player",
    description: "Feel Formula 1 like never before in F1 23 on our new VR simulator at Reset XR. Experience every corner, the speed of the cars and the intensity of the world’s most iconic races with immersive realism that puts you in the driver’s seat. Ready for the chequered flag?",
    duration: "30 mins",
    price: "€20.00",
    seats: null
  },
  {
    title: "Dream Hackers",
    tags: ["NEW!"],
    players: "1 to 6",
    description: "We are the Dream Hackers. Our team has found a way to travel through shared dreams by synchronising brain rhythms, discovering a realm of dreams and nightmares. Meet magical beasts, wander streets of cities that never existed, and tinker with past and future events. Our goal: uncover the ancient Citadel and seize the powerful Book of Memories.",
    duration: "50 mins",
    price: "€28.50",
    seats: "1 seat"
  },
  {
    title: "Minecraft VR",
    tags: ["NEW!", "GET 15 % OFF WITH CODE MINECRAFT15"],
    players: "Multiplayer 1 to 7",
    description: "Enter an infinite world where you can build, explore and survive in total immersion. Mine resources, craft tools and face creatures as you shape your own first-person adventure. Experience Minecraft’s essence with a sense of scale and depth that transports you to the heart of the game.",
    duration: "50 mins",
    price: "€26.00",
    seats: "1 seat"
  },
  {
    title: "Elven Assassin",
    tags: [],
    players: "1 to 4",
    description: "Become an archer in this VR game. Wield your bow and learn magic to defeat your enemies. Take up your bow and stop the hordes of orcs and beasts invading your land.",
    duration: "50 mins",
    price: "€26.00",
    seats: "1 seat"
  },
  {
    title: "Paintball VR",
    tags: ["NEW!"],
    players: "2 to 10",
    description: "A multicolour VR shooter where the war is fought with paint! Dive into maps full of hideouts, traps and glorious chances to splatter foes with precise ink shots. Team up with up to six partners, dodge paintballs like taxes and use real-world moves for your battle dance. Shout, laugh, miss impossible shots and celebrate every win like a world-cup final—because winning with style matters most.",
    duration: "50 mins",
    price: "€26.00",
    seats: "2 seats"
  },
  {
    title: "Propagation",
    tags: [],
    players: "1 to 2",
    description: "VR simulation of a zombie apocalypse. Armed only with your weapons and fists, fight zombies and terrifying creatures of many kinds… can you survive?",
    duration: "30 mins",
    price: "€20.00",
    seats: "1 seat"
  },
  {
    title: "Beat Saber",
    tags: ["TOP SELLER!"],
    players: "1 to 4",
    description: "An exhilarating rhythm game in VR where you become a music-ninja. Use your light-sabers to slice blocks to the beat while dodging obstacles. With a wide song list and difficulty levels, Beat Saber lets you test your skills and enjoy music simultaneously.",
    duration: "30 mins",
    price: "€20.00",
    seats: "1 seat"
  },
  {
    title: "Vader Immortal: Episode 1",
    tags: ["NEW!"],
    players: "Single Player",
    description: "You are a smuggler captured by the Empire and taken to Mustafar. Darth Vader reveals your connection to the Force and recruits you to find an ancient artefact. Learn to wield a lightsaber while exploring Vader’s fortress. Combines combat and story in the Star Wars universe.",
    duration: "50 mins",
    price: "€26.00",
    seats: null
  },
  {
    title: "Kayak",
    tags: [],
    players: "Single Player",
    description: "VR simulation for an exciting kayaking adventure. Explore rivers and seas, travelling through stunning landscapes and wildlife. With intuitive gameplay and immersive experience, Kayak VR Mirage is the perfect escape to nature.",
    duration: "30 mins",
    price: "€20.00",
    seats: "1 seat"
  },
  {
    title: "Pavlov",
    tags: [],
    players: "1 to 5",
    description: "A first-person shooter immersing you in intense VR combat. Challenge friends or join teams in exciting matches. Test your strategy and aim while fighting for survival.",
    duration: "50 mins",
    price: "€26.00",
    seats: "1 seat"
  },
  {
    title: "Among Us",
    tags: [],
    players: "Minimum 4 players for a private game",
    description: "You are crewmates on a spaceship, but impostors aim to sabotage and eliminate the crew. Work together to finish tasks and discover the impostors through votes and discussion. Intrigue and strategy are key to survive and win.",
    duration: "50 mins",
    price: "€26.00",
    seats: "1 seat"
  },
  {
    title: "FNAF Help Wanted",
    tags: [],
    players: "Single Player",
    description: "A VR game plunging you into the terrifying world of the Five Nights at Freddy’s series. As a security guard, face horrifying animatronics while completing tasks to survive. Immersive graphics and tense gameplay create a chilling experience fans will love.",
    duration: "30 mins",
    price: "€20.00",
    seats: "1 seat"
  },
  {
    title: "All-In-One",
    tags: [],
    players: "1 to 6",
    description: "Enjoy multiple sports in one game—baseball, archery, ping-pong, boxing, tennis and squash. Compete in real time in PvP, with realistic physics. Customise your player; simple interface and easy controls welcome everyone. Choose from five difficulty levels, beginner to pro, and test your skills.",
    duration: "50 mins",
    price: "€26.00",
    seats: "1 seat"
  },
  {
    title: "X-Fighter",
    tags: [],
    players: "Single Player",
    description: "A VR game that fuses boxing with augmented reality. Engage in thrilling close-quarters fights against challenging opponents in immersive virtual settings. Use your boxing skills and agility to defeat rivals and become the ultimate champion.",
    duration: "30 mins",
    price: "€20.00",
    seats: null
  },
  {
    title: "Mini Golf",
    tags: [],
    players: "1 to 6",
    description: "Escape to a fun, beautiful world with the best minigolf courses you’ve ever seen. Challenge friends in a private match, enjoy solo play or compete with strangers.",
    duration: "50 mins",
    price: "€26.00",
    seats: "1 seat"
  },
  {
    title: "Arena",
    tags: [],
    players: "1 to 7",
    description: "Dynamic multiplayer VR action with sci-fi elements. Rich maps and weapons delight action fans. Prove yourself as a modern-day gladiator: form teams, use every tactic you know and conquer your enemies. Only the most skilled players will prevail.",
    duration: "50 mins",
    price: "€28.50",
    seats: "1 seat"
  },
  {
    title: "Smash Point",
    tags: [],
    players: "1 to 7",
    description: "Dive into an animated world, chase and blast others with fun new weapons. A competitive VR multiplayer shooter in Deathmatch (everyone-for-themselves) mode, so the fun never ends.",
    duration: "50 mins",
    price: "€28.50",
    seats: "1 seat"
  },
  {
    title: "The Lab",
    tags: [],
    players: "Single Player",
    description: "A collection of VR minigames and experiences designed to introduce users to VR and whet their appetite for future adventures.",
    duration: "30 mins",
    price: "€20.00",
    seats: "1 seat"
  },
  {
    title: "Gravity Sketch",
    tags: [],
    players: null,
    description: "A VR design program. Unleash your creativity to craft favourite figures or 3D models—we can email them to you!",
    duration: "30 mins",
    price: "€20.00",
    seats: "1 seat"
  },
  {
    title: "Tilt Brush",
    tags: [],
    players: "Single Player",
    description: "A VR art program. Unleash your creativity—the room is your canvas and your imagination the palette. Possibilities are unlimited!",
    duration: "30 mins",
    price: "€20.00",
    seats: "1 seat"
  },
  {
    title: "Google Earth",
    tags: [],
    players: "Single Player",
    description: "VR simulation letting you explore the world from a new perspective. Travel anywhere on the planet and explore landscapes, cities and landmarks in 3D. Easy-to-use interface and many features—perfect for travel and geography lovers.",
    duration: "30 mins",
    price: "€20.00",
    seats: "1 seat"
  },
  {
    title: "Hyperdash",
    tags: [],
    players: "1 to 10",
    description: "A VR game placing players in intense battles within futuristic environments. Emphasising speed and chaos, team up with friends to destroy as many enemies as possible or face off in frenetic Free-for-All matches. Control a battle drone, speed across the field combining teleportation with rail-sliding, and use dual weapons to eliminate every foe.",
    duration: "50 mins",
    price: "€26.00",
    seats: "1 seat"
  },
  {
    title: "Breachers",
    tags: [],
    players: "1 to 5",
    description: "A VR game plunging players into intense tactical battles in futuristic settings. Emphasising cooperation and strategy, teams complete challenging missions using unique abilities and advanced weapons. Stunning graphics and immersive gameplay deliver an exciting, adrenaline-charged VR experience.",
    duration: "50 mins",
    price: "€26.00",
    seats: "1 seat"
  }
];

</script>

<div class="page-container">
  <h1 class="page-title">Our Games</h1>
  
  <div class="games-list">
    {#each games as game}
      <div class="game-card">
        <h2>{game.title}</h2>
        
        <div class="tags">
          {#if game.tags && game.tags.length > 0}
            {#each game.tags as tag}
              <span class="tag {tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}">{tag}</span>
            {/each}
          {/if}
        </div>

        {#if game.players}
          <p class="players"><strong>Players:</strong> {game.players}</p>
        {/if}
        
        <p class="description">{game.description}</p>
        
        <div class="game-footer">
          <span class="read-more">Read more</span>
          <span class="duration">{game.duration}</span>
          <span class="price">{game.price}</span>
          {#if game.seats}
            <span class="seats">{game.seats}</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .page-container {
    padding: 20px;
    border-radius: 8px;
    color: #fff;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    text-align: left;
  }

  .page-title {
    color: var(--highlight-color, #e6007e);
    margin-bottom: 25px;
    text-align: center;
    font-size: 2.2em;
  }

  .games-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .game-card {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid #444;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .game-card h2 {
    color: var(--highlight-color, #e6007e);
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.6em;
  }

  .tags {
    margin-bottom: 10px;
  }

  .tag {
    display: inline-block;
    background-color: #e6007e;
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    margin-right: 5px;
    margin-bottom: 5px;
    text-transform: uppercase;
  }
  .tag.new {
    background-color: #5cb85c;
  }
  .tag.top-seller {
    background-color: #f0ad4e;
  }
  .tag.get-15--off-with-code-f1rx23,
  .tag.get-15--off-with-code-minecraft15 {
    background-color: #337ab7;
    font-size: 0.75em;
  }

  .players {
    font-size: 0.9em;
    color: #ccc;
    margin-bottom: 10px;
  }

  .description {
    font-size: 0.95em;
    line-height: 1.5;
    color: #dcdcdc;
    margin-bottom: 15px;
    flex-grow: 1;
  }

  .game-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9em;
    color: #aaa;
    border-top: 1px solid #444;
    padding-top: 10px;
    margin-top: auto;
  }

  .read-more {
    color: var(--highlight-color, #87cefa);
    cursor: pointer;
    text-decoration: underline;
  }
  .read-more:hover {
    color: #fff;
  }

  .price {
    font-weight: bold;
    color: #e6007e;
  }
</style>
