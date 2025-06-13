import animal from '../assets/AVATAR_ANIMAL.png';
import computer from '../assets/AVATAR_COMPUTER.png';
import female from '../assets/AVATAR_FEMALE.png';
import male from '../assets/AVATAR_MALE.png';
import React from 'react';
import { useState } from 'react';
import '../styles/Menu.css';

const avatars = [
  { id: 'ANIMAL', name: 'Animal', image: animal },
  { id: 'COMPUTER', name: 'Computer', image: computer },
  { id: 'FEMALE', name: 'Female', image: female },
  { id: 'MALE', name: 'Male', image: male },
];

function Menu({ onStart }) {
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [playerName, setPlayerName] = useState('');
  
  const nextAvatar = () => {
    const idx = avatars.indexOf(selectedAvatar);
    const next = avatars[(idx + 1) % avatars.length];
    setSelectedAvatar(next);
    localStorage.setItem('selectedAvatar', next.id);
  };

  const prevAvatar = () => {
    const idx = avatars.indexOf(selectedAvatar);
    const prev = avatars[(idx - 1 + avatars.length) % avatars.length];
    setSelectedAvatar(prev);
    localStorage.setItem('selectedAvatar', prev.id);
  };

  const handleNameChange = (e) => {
    const name = e.target.value.trim();
    setPlayerName(name);
    localStorage.setItem('playerName', name);
  }

  const handleExploreClick = () => {
    if (!playerName) {
      alert('Please enter your name before exploring!');
      return;
    }
    if (onStart) onStart();
  }


  return (
    <>
       <div className="main-container">
        <h1 className="main-title">Avataria Life</h1>
        
        <div className="content-box">
            <div className="avatar-selection">
                <h2>Choose Your Avatar</h2>
                <div className="avatar-carousel">
                    <button onClick={prevAvatar} className="arrow-btn left-arrow" aria-label="Previous avatar">&#9664;</button>
                    
                    <div className="avatars-container">
                        <div className="avatars">
                            <div className="avatar-option" data-avatar={selectedAvatar.id.toLowerCase()}>
                              <img src={selectedAvatar.image} alt={selectedAvatar.name} />
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={nextAvatar} className="arrow-btn right-arrow" aria-label="Next avatar">&#9654;</button>
                </div>
                <div className="avatar-name" id="avatarName">{selectedAvatar.name}</div>
            </div>

            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter your name here..."
                    id="nameInput"
                    value={playerName}
                    onChange={handleNameChange}
                />
            </div>

            <button onClick={handleExploreClick}  className="btn" id="exploreBtn">Start Exploring</button>
        </div>
        </div>
    </>
  );
}

export default Menu;
