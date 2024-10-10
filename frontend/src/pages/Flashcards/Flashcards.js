import React, { useState, useEffect } from "react";
import "./Flashcards.css";
import artPiecesData from "../../Data/artworks.json"; // Import the JSON data

const Flashcards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState([...artPiecesData]); // Use JSON data as the deck
  const [excludedCardIds, setExcludedCardIds] = useState([]); // Cards to exclude
  const [selectedUnits, setSelectedUnits] = useState([]); // Units to include
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // Toggle settings modal

  // Shuffle flashcards based on unit and exclusions
  const shuffleDeck = () => {
    const filteredDeck = artPiecesData.filter(
      (card) =>
        (selectedUnits.length === 0 || selectedUnits.includes(card.unit)) &&
        !excludedCardIds.includes(card.id)
    );
    const shuffledDeck = [...filteredDeck].sort(() => Math.random() - 0.5);
    setDeck(shuffledDeck);
    setCurrentCard(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    shuffleDeck(); // Shuffle deck on component mount
  }, [selectedUnits, excludedCardIds]); // Reshuffle deck when units or excluded cards change

  const handleFlip = () => {
    if (!isTransitioning) {
      setIsFlipped(!isFlipped); // Flip the card to show the back
    }
  };

  const handleAction = (action) => {
    if (isTransitioning) return;

    setIsTransitioning(true); // Block interaction during transition

    // After the card flips, replace it with a new instance
    setTimeout(() => {
      let updatedDeck = [...deck];

      if (action === "great") {
        // Remove the card if marked as "Great"
        updatedDeck = deck.filter((_, index) => index !== currentCard);
      }

      // Move to the next card or reset to 0 if necessary
      setCurrentCard((prev) => (prev + 1) % updatedDeck.length);

      // Ensure the new card starts with the front side facing up
      setIsFlipped(false);
      setDeck(updatedDeck);
      setIsTransitioning(false);
    }, 300); // Adjust delay as needed for smooth transitions
  };

  const resetDeck = () => {
    shuffleDeck();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleExcludedIdsChange = (event) => {
    const ids = event.target.value.split(",").map(Number);
    setExcludedCardIds(ids);
  };

  const handleUnitSelection = (event) => {
    const unit = Number(event.target.value);
    if (event.target.checked) {
      setSelectedUnits([...selectedUnits, unit]);
    } else {
      setSelectedUnits(selectedUnits.filter((u) => u !== unit));
    }
  };

  if (deck.length === 0) {
    return (
      <div className="flashcards-container">
        <h2>All cards marked as Great! Reset the deck to continue.</h2>
        <button className="reset-button" onClick={resetDeck}>
          Reset Deck
        </button>
      </div>
    );
  }

  return (
    <div className="flashcards-container">
      <div className="progress">{deck.length} cards remaining</div>
      <div
        className={`flashcard ${isFlipped ? "flipped" : ""}`}
        onClick={!isTransitioning ? handleFlip : null} // Allow flip on click
      >
        <div className="flashcard-inner">
          {/* Front: Show the spotlight image */}
          <div className="flashcard-front">
            <img
              src={require(`../../artImages/${deck[currentCard].image[0]}`)} // Use image path from JSON
              alt={deck[currentCard].name}
              className="flashcard-image"
            />
          </div>

          {/* Back: Show name and identifiers */}
          <div className="flashcard-back">
            {isFlipped && (
              <>
                <h3 className="flashcard-title">
                  {deck[currentCard].id}.{" "}
                  <strong>{deck[currentCard].name}</strong>
                </h3>
                <p>Location: {deck[currentCard].location}</p>
                <p>
                  Artist/Culture:{" "}
                  {deck[currentCard].artist_culture || "Unknown"}
                </p>
                <p>Date: {deck[currentCard].date}</p>
                <p>Materials: {deck[currentCard].materials}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <button
          className="bad-button"
          onClick={!isTransitioning ? () => handleAction("bad") : null}
        >
          Bad
        </button>
        <button
          className="good-button"
          onClick={!isTransitioning ? () => handleAction("good") : null}
        >
          Good
        </button>
        <button
          className="great-button"
          onClick={!isTransitioning ? () => handleAction("great") : null}
        >
          Great
        </button>
      </div>
      <button className="reset-button" onClick={resetDeck}>
        Reset Deck
      </button>

      {/* Settings Button */}
      <button className="settings-button" onClick={toggleSettings}>
        <i className="fas fa-cog"></i> Settings
      </button>

      {/* Sliding Settings Modal */}
      <div className={`settings-modal ${showSettings ? "show" : ""}`}>
        <h3>Settings</h3>
        <div className="unit-selection">
          <h4>Select Units to Include</h4>
          {[...new Set(artPiecesData.map((item) => item.unit))].map((unit) => (
            <label key={unit}>
              <input
                type="checkbox"
                value={unit}
                onChange={handleUnitSelection}
                checked={selectedUnits.includes(unit)}
              />
                Unit {unit}
            </label>
          ))}
        </div>
        <div className="exclude-ids">
          <h4>Exclude Specific Card IDs</h4>
          <input
            type="text"
            placeholder="Comma-separated IDs"
            onChange={handleExcludedIdsChange}
          />
        </div>
        <button className="close-settings" onClick={toggleSettings}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
