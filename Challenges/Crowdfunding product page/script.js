// Load project data
async function loadProjectData() {
    try {
        const response = await fetch('mastercraftBambooMonitorRiserData.json');
        const data = await response.json();

        generateProductSummary(data.Details);
        generateRewardsHTML(data);
    } catch (error) {
        console.error('Error fetching project data:', error);
    }
}

function generateProductSummary(details){
    document.getElementById('ammountAchieved').textContent = '$' + details.amountBacked;
    document.getElementById('ammountGoal').textContent = `of $${details.goal} backed`;
    document.getElementById('backersAmmount').textContent = details.numberOfBackers;

    const currentDate = new Date(); 
    const endDateObj = new Date(details.endDate);
    const daysLeft = Math.ceil((endDateObj - currentDate) / (1000 * 60 * 60 * 24));
    document.getElementById('daysLeft').textContent = daysLeft >= 0 ? daysLeft : 0;

    let completionPercentage = (details.amountBacked * 100) / details.goal;
    document.getElementById('loadingBar').style.width = `${completionPercentage}%`;
}

// Generate rewards section - details
function generateRewardsHTML(data) {
    const rewardsSection = document.getElementById('rewards-section');
    rewardsSection.innerHTML = '';

    // About section
    const aboutSection = `
        <div>
            <div class="section-content">
                <h2 class="results-title">About this project</h2>
                <p class="results-subtitle">${data.Details['description']}</p>
            </div>
        </div>
    `;
    rewardsSection.insertAdjacentHTML('beforeend', aboutSection);

    // Rewards section
    data.rewards.forEach(reward => {
        const rewardSection = document.createElement('div');
        rewardSection.classList.add('section');
        rewardSection.classList.add('border-noShadow');

        if (reward.stock === 0) {
            rewardSection.classList.add('out-of-stock');
        }

        const rewardContent = `
            <div class="section-content">
                <div class="section-content_head">
                    <h2 class="results-title"><strong>${reward.name}</strong></h2>
                    ${reward.minimumPledgeAmmount ? `<h2 class="clr-cyanLight">Pledge $${reward.minimumPledgeAmmount} or more</h2>` : ''}
                </div>
                <p class="results-subtitle">${reward.description}</p>

                <div class="section-content_bottom">
                    <p><strong>${reward.stock}</strong> left</p>
                    <button class="btn-style1 select-reward" data-id="${reward.id}" ${reward.stock === 0 ? 'disabled' : ''}>
                        ${reward.stock === 0 ? 'Out of Stock' : 'Select Reward'}
                    </button>
                </div>
            </div>
        `;

        rewardSection.innerHTML = rewardContent;
        rewardsSection.appendChild(rewardSection);
    });

    // Add event listeners to "Select Reward" buttons
    document.querySelectorAll('.select-reward').forEach(button => {
        button.addEventListener('click', function() {
            const rewardId = this.getAttribute('data-id');
            openRewardsModal(rewardId);
        });
    });
}

// Function to open the rewards modal and select the right radio button
async function openRewardsModal(rewardId) {
    const modal = await loadModal('modals/backThisProjectModal.html', 'backThisProjectModal');
    
    if (modal) {
        // Find the radio button for the selected reward and check it
        const radioToSelect = modal.querySelector(`input[type="radio"][data-reward-id="${rewardId}"]`);
        if (radioToSelect) {
            radioToSelect.checked = true;
        }
        
        setupBackupThisProjectModalEventListeners(modal);
    }
}

// Hamburger menu toggle
const hamburguerBtn = document.getElementById('hamburguer');
const navLinksContainer = document.getElementById('nav-links-container');

hamburguerBtn.addEventListener('click', () => {
    hamburguerBtn.classList.toggle('is-open');
    navLinksContainer.classList.toggle('is-open');
});

// Modal scripts
async function loadModal(modalFile, modalId) {
    try {
        const response = await fetch(modalFile);
        const data = await response.text();

        document.getElementById('modal-container').innerHTML = data;
        const modal = document.getElementById(modalId);

        const projectDataResponse = await fetch('mastercraftBambooMonitorRiserData.json');
        const projectData = await projectDataResponse.json();

        // Generate HTML for the rewards modal only
        if (modalId === 'backThisProjectModal') {
            generateModalRewardsHTML(projectData);
        }

        modal.style.display = 'block';

        modal.querySelectorAll('#close').forEach(closeButton => {
            closeButton.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        });

        return modal;
    } catch (error) {
        console.error('Error loading modal:', error);
    }
}

// Generate rewards section - modal
function generateModalRewardsHTML(data) {
    const modalContainer = document.querySelector('.sections-modal-container');
    modalContainer.innerHTML = '';

    const noRewardHTML = `
        <div class="section section-modal">
            <div class="section-modal-content">
                <div class="radio-section">
                    <label class="custom-radio">
                        <input type="radio" name="backProject" class="radio-input">
                        <span class="radio-custom"></span>
                    </label>
                </div>
                <div>
                    <h2 class="results-title"><strong>Pledge with no reward</strong></h2>
                    <p>Choose to support us without a reward if you simply believe in our project. As a backer, you will be signed up to receive product updates via email.</p>
                </div>
            </div>
            <div class="pledge-section">
                <form id="successModal-form">
                    <button class="btn-style1">Continue</button>
                </form>
            </div>
        </div>
    `;
    modalContainer.insertAdjacentHTML('beforeend', noRewardHTML);

    data.rewards.forEach(reward => {
        const rewardHTML = `
            <div class="section section-modal ${reward.stock === 0 ? 'out-of-stock' : ''}">
                <div class="section-modal-content">
                    <div class="radio-section">
                        <label class="custom-radio">
                            <input type="radio" name="backProject" class="radio-input" data-reward-id="${reward.id}" ${reward.stock === 0 ? 'disabled' : ''}>
                            <span class="radio-custom"></span>
                        </label>
                    </div>
                    <div>
                        <div class="section-title-container">
                            <h2 class="results-title"><strong>${reward.name}</strong></h2>
                            <h2 class="clr-cyanLight">Pledge $${reward.minimumPledgeAmmount} or more</h2>
                            <p><strong>${reward.stock}</strong> left</p>
                        </div>
                        <p>${reward.description}</p>
                    </div>
                </div>
                <form class="pledge-section" id="successModal-form">
                    <p name="pledge">Enter your pledge</p>
                    <div class="input-style1">
                        $<input type="number" min="${reward.minimumPledgeAmmount}" required ${reward.stock === 0 ? 'disabled' : ''}>
                    </div>
                    <button type="submit" class="btn-style1" ${reward.stock === 0 ? 'disabled' : ''}>Continue</button>
                </form>
            </div>
        `;
        modalContainer.insertAdjacentHTML('beforeend', rewardHTML);
    });

}

document.getElementById('backThisProject-btn').addEventListener('click', async function() {
    const modal = await loadModal('modals/backThisProjectModal.html', 'backThisProjectModal');
    
    if (modal) {
        setupBackupThisProjectModalEventListeners(modal);
    }
});

// To load events for modal html elements after they are rendered in the DOM
function setupBackupThisProjectModalEventListeners(modal) {
    const radioButtons = modal.querySelectorAll('.radio-input');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            removeSelectedBorderFromModalSections(modal);
            const parentContainer = radio.closest('.section');

            if (radio.checked) {
                parentContainer.classList.add('selected');
            }
        });
    });

    modal.querySelectorAll('#successModal-form').forEach(button => {
        button.addEventListener('submit', async function(e) {
            e.preventDefault();
            modal.style.display = 'none';
            await loadModal('modals/successModal.html', 'successModal');
        });
    });  
}

function removeSelectedBorderFromModalSections(modal) {
    const sections = modal.querySelectorAll('.section.section-modal');
    sections.forEach(section => {
        section.classList.remove('selected');
    });
}

// Load the project data when the page loads
document.addEventListener('DOMContentLoaded', loadProjectData);
