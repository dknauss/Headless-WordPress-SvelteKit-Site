Feature: Rating interaction
  In order to reflect lightweight community sentiment on the card collection
  As a visitor with a signed session
  I want a single rating action per card that can be applied and removed safely

  Scenario: A visitor rates a card once
    Given a card starts with no votes from the current session
    When the visitor rates the card
    Then the rating increases by one
    And the session is recorded as having voted on that card

  Scenario: A visitor clicks rate twice on the same card
    Given the visitor has already rated the card
    When the visitor rates the same card again
    Then the rating does not increase again
    And the stored vote remains singular for that session

  Scenario: A visitor removes an existing vote
    Given the visitor has already rated the card
    When the visitor removes the vote
    Then the rating decreases by one
    And the session no longer has a vote recorded for that card
