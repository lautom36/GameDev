MyGame.particles = function(spec) {
//------------------------------------------------------------------
//
// This is the particle system use by the game code
//
//------------------------------------------------------------------
  'use strict';
  let nextName = 1;       // Unique identifier for the next particle
  let particles = {};

  //------------------------------------------------------------------
  //
  // This creates one new particle
  //
  //------------------------------------------------------------------
  function create() {
    // console.log(spec);
    // get a random location across the surface area
    let x = spec.center.x - spec.width / 2 + Math.random() * spec.width;
    let y = spec.center.y - spec.height / 2 + Math.random() * spec.height;
    
    let p = {
            center: { x: x, y: y },
            size: 1,  // Making square particles
            direction: {x: 0, y: 1},
            speed: Math.random() * 100, // pixels per second
            rotation: 0,
            lifetime: Math.random(),    // How long the particle should live, in seconds
            alive: 0,    // How long the particle has been alive, in seconds
            color: spec.color,
        };

    return p;
  }

  //------------------------------------------------------------------
  //
  // Update the state of all particles.  This includes removing any that have exceeded their lifetime.
  //
  //------------------------------------------------------------------
  function update(elapsedTime) {
      let removeMe = [];

      //
      // We work with time in seconds, elapsedTime comes in as milliseconds
      elapsedTime = elapsedTime / 1000;
      
      Object.getOwnPropertyNames(particles).forEach(function(value, index, array) {
          let particle = particles[value];
          //
          // Update how long it has been alive
          particle.alive += elapsedTime;

          //
          // Update its center
          particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
          particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

          // Rotate proportional to its speed
          // particle.rotation += particle.speed / 500;

          //
          // If the lifetime has expired, identify it for removal
          if (particle.alive > particle.lifetime) {
              removeMe.push(value);
          }
      });

      //
      // Remove all of the expired particles
      for (let particle = 0; particle < removeMe.length; particle++) {
          delete particles[removeMe[particle]];
      }
      removeMe.length = 0;

      //
      // Generate some new particles
      // for (let particle = 0; particle < 1; particle++) {
      //     //
      //     // Assign a unique name to each particle
      //     particles[nextName++] = create();
      // }
  }

  function createParticles() {
    for (let particle = 0; particle < 1000; particle++) {
        //
        // Assign a unique name to each particle
        particles[nextName++] = create();
    }
}

let api = {
    update: update,
    createParticles: createParticles,
    get particles() { return particles; }
};

  return api;
}
