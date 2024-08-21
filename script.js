  document.addEventListener("DOMContentLoaded", function () {
    fetch('challenges.json')
      .then(response => response.json())
      .then(challenges => {
        const challengesContainer = document.querySelector('.challengesContainer');
        
        challenges.forEach(challenge => {
          const challengeDiv = document.createElement('div');
          challengeDiv.classList.add('challenge');
          
          const title = document.createElement('h3');
          title.textContent = challenge.title;
          challengeDiv.appendChild(title);
          
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('imgContainer');
          
          const img = document.createElement('img');
          img.classList.add('challengeImg');
          img.src = challenge.imageSrc;
          img.alt = challenge.title;
          
          imgContainer.appendChild(img);
          challengeDiv.appendChild(imgContainer);
          
          const button = document.createElement('button');
          const link = document.createElement('a');
          link.href = challenge.url;
          link.textContent = 'GO';
          
          button.appendChild(link);
          challengeDiv.appendChild(button);
          
          challengesContainer.appendChild(challengeDiv);
        });
      })
      .catch(error => console.error('Error fetching challenges:', error));
  });
