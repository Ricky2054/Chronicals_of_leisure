class ConversationManager {
  constructor() {
    this.conversations = {
      intro: {
        id: 'intro',
        title: 'The Beginning',
        messages: [
          {
            character: {
              name: 'Wise Sage',
              title: 'Ancient Guardian',
              sprite: '🧙‍♂️',
              spritePath: '/sprites/Knight/Knight/noBKG_KnightIdle_strip.png',
              color: '#8B4513'
            },
            text: 'Welcome, brave knight! The realm is in grave danger. Three powerful bosses have risen to power and threaten to destroy everything we hold dear.'
          },
          {
            character: {
              name: 'Wise Sage',
              title: 'Ancient Guardian',
              sprite: '🧙‍♂️',
              spritePath: '/sprites/Knight/Knight/noBKG_KnightIdle_strip.png',
              color: '#8B4513'
            },
            text: 'The Dragon Lord breathes fire from the eastern mountains, the Lich King commands dark magic from his frozen fortress, and the Demon Prince wields lightning from the depths of hell.'
          },
          {
            character: {
              name: 'Wise Sage',
              title: 'Ancient Guardian',
              sprite: '🧙‍♂️',
              spritePath: '/sprites/Knight/Knight/noBKG_KnightIdle_strip.png',
              color: '#8B4513'
            },
            text: 'You are the chosen one, destined to face these evils. Collect powerful artifacts, gain strength, and prepare for the ultimate battles that await you.'
          },
          {
            character: {
              name: 'Wise Sage',
              title: 'Ancient Guardian',
              sprite: '🧙‍♂️',
              spritePath: '/sprites/Knight/Knight/noBKG_KnightIdle_strip.png',
              color: '#8B4513'
            },
            text: 'Remember: Use WASD to move, Space to jump, J to attack, and Shift to dodge. Good luck, brave knight!'
          }
        ]
      },
      boss_dragon: {
        id: 'boss_dragon',
        title: 'Dragon Lord Encounter',
        messages: [
          {
            character: {
              name: 'Dragon Lord',
              title: 'Master of Fire',
              sprite: '🐉',
              spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0056-900920138.png',
              color: '#8B0000'
            },
            text: 'Foolish mortal! You dare challenge the Dragon Lord? I have ruled these lands for centuries, and you will be nothing but ash!'
          },
          {
            character: {
              name: 'Dragon Lord',
              title: 'Master of Fire',
              sprite: '🐉',
              spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0056-900920138.png',
              color: '#8B0000'
            },
            text: 'Feel the power of my fire breath! No weapon can pierce my scales, no armor can withstand my flames!'
          },
          {
            character: {
              name: 'Dragon Lord',
              title: 'Master of Fire',
              sprite: '🐉',
              spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0056-900920138.png',
              color: '#8B0000'
            },
            text: 'But if you somehow defeat me... know that the Lich King and Demon Prince are far more powerful than I. Your quest is doomed to failure!'
          }
        ]
      },
      boss_lich: {
        id: 'boss_lich',
        title: 'Lich King Encounter',
        messages: [
          {
            character: {
              name: 'Lich King',
              title: 'Master of Death',
              sprite: '💀',
              spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0064-4100537310.png',
              color: '#4B0082'
            },
            text: 'Ah, the chosen knight arrives. I have watched your progress with great interest. You defeated the Dragon Lord... impressive.'
          },
          {
            character: {
              name: 'Lich King',
              title: 'Master of Death',
              sprite: '💀',
              spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0064-4100537310.png',
              color: '#4B0082'
            },
            text: 'But I am far older and more powerful than that overgrown lizard. I have mastered the dark arts for millennia. Death itself bends to my will!'
          },
          {
            character: {
              name: 'Lich King',
              title: 'Master of Death',
              sprite: '💀',
              spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0064-4100537310.png',
              color: '#4B0082'
            },
            text: 'Your soul will make a fine addition to my collection. Prepare to join the ranks of the undead!'
          }
        ]
      },
      boss_demon: {
        id: 'boss_demon',
        title: 'Demon Prince Encounter',
        messages: [
          {
            character: {
              name: 'Demon Prince',
              title: 'Lord of Chaos',
              sprite: '👹',
              spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0063-4100537309.png',
              color: '#DC143C'
            },
            text: 'So, the mortal who defeated my brothers has finally arrived. I must admit, I did not expect you to make it this far.'
          },
          {
            character: {
              name: 'Demon Prince',
              title: 'Lord of Chaos',
              sprite: '👹',
              spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0063-4100537309.png',
              color: '#DC143C'
            },
            text: 'But now you face the true power of hell itself! I am the strongest of the three, and I will not fall as easily as they did!'
          },
          {
            character: {
              name: 'Demon Prince',
              title: 'Lord of Chaos',
              sprite: '👹',
              spritePath: '/sprites/Monster%20Creature%20sprites%20(pack%201%20by%20batareya)/pixel-0063-4100537309.png',
              color: '#DC143C'
            },
            text: 'Your world will burn, your people will suffer, and your name will be forgotten! This is where your legend ends!'
          }
        ]
      },
      victory: {
        id: 'victory',
        title: 'Victory!',
        messages: [
          {
            character: {
              name: 'Wise Sage',
              title: 'Ancient Guardian',
              sprite: '🧙‍♂️',
              spritePath: '/sprites/Knight/Knight/noBKG_KnightIdle_strip.png',
              color: '#8B4513'
            },
            text: 'Incredible! You have done it, brave knight! You have defeated all three bosses and saved the realm from destruction!'
          },
          {
            character: {
              name: 'Wise Sage',
              title: 'Ancient Guardian',
              sprite: '🧙‍♂️',
              spritePath: '/sprites/Knight/Knight/noBKG_KnightIdle_strip.png',
              color: '#8B4513'
            },
            text: 'The Dragon Lord\'s fire has been extinguished, the Lich King\'s dark magic has been broken, and the Demon Prince has been banished back to hell!'
          },
          {
            character: {
              name: 'Wise Sage',
              title: 'Ancient Guardian',
              sprite: '🧙‍♂️',
              spritePath: '/sprites/Knight/Knight/noBKG_KnightIdle_strip.png',
              color: '#8B4513'
            },
            text: 'The people will sing songs of your bravery for generations to come. You are truly the greatest hero the realm has ever known!'
          },
          {
            character: {
              name: 'Wise Sage',
              title: 'Ancient Guardian',
              sprite: '🧙‍♂️',
              spritePath: '/sprites/Knight/Knight/noBKG_KnightIdle_strip.png',
              color: '#8B4513'
            },
            text: 'But remember, new threats may arise in the future. The realm will always need heroes like you to protect it. Rest well, champion!'
          }
        ]
      },
      collectible_coin: {
        id: 'collectible_coin',
        title: 'Treasure Found',
        messages: [
          {
            character: {
              name: 'Treasure Spirit',
              title: 'Guardian of Wealth',
              sprite: '💰',
              color: '#FFD700'
            },
            text: 'Ah, you have found ancient gold! These coins have been hidden for centuries, waiting for a worthy hero to claim them.'
          },
          {
            character: {
              name: 'Treasure Spirit',
              title: 'Guardian of Wealth',
              sprite: '💰',
              color: '#FFD700'
            },
            text: 'Use them wisely, brave knight. Gold can buy powerful equipment and magical items that will aid you in your quest.'
          }
        ]
      },
      collectible_potion: {
        id: 'collectible_potion',
        title: 'Healing Potion',
        messages: [
          {
            character: {
              name: 'Healing Spirit',
              title: 'Guardian of Life',
              sprite: '🧪',
              color: '#FF0000'
            },
            text: 'A healing potion! This magical elixir will restore your health and keep you fighting fit for the battles ahead.'
          },
          {
            character: {
              name: 'Healing Spirit',
              title: 'Guardian of Life',
              sprite: '🧪',
              color: '#FF0000'
            },
            text: 'Remember, brave knight, even the strongest warriors need to heal their wounds. Use this gift wisely!'
          }
        ]
      },
      powerup_speed: {
        id: 'powerup_speed',
        title: 'Speed Boost',
        messages: [
          {
            character: {
              name: 'Wind Spirit',
              title: 'Guardian of Speed',
              sprite: '⚡',
              color: '#00FF00'
            },
            text: 'Feel the power of the wind! This magical enhancement will make you move faster than ever before!'
          },
          {
            character: {
              name: 'Wind Spirit',
              title: 'Guardian of Speed',
              sprite: '⚡',
              color: '#00FF00'
            },
            text: 'Speed is a warrior\'s greatest ally. Use this gift to outmaneuver your enemies and strike with lightning-fast precision!'
          }
        ]
      },
      powerup_damage: {
        id: 'powerup_damage',
        title: 'Damage Boost',
        messages: [
          {
            character: {
              name: 'War Spirit',
              title: 'Guardian of Strength',
              sprite: '⚔️',
              color: '#FF4500'
            },
            text: 'Feel the power of war flow through your veins! Your attacks will now strike with devastating force!'
          },
          {
            character: {
              name: 'War Spirit',
              title: 'Guardian of Strength',
              sprite: '⚔️',
              color: '#FF4500'
            },
            text: 'With this power, even the mightiest bosses will fall before your blade. Strike true, brave warrior!'
          }
        ]
      }
    };
  }

  getConversation(id) {
    return this.conversations[id] || null;
  }

  getIntroConversation() {
    return this.conversations.intro;
  }

  getBossConversation(bossType) {
    const bossConversations = {
      'dragon': this.conversations.boss_dragon,
      'lich': this.conversations.boss_lich,
      'demon': this.conversations.boss_demon
    };
    return bossConversations[bossType] || null;
  }

  getVictoryConversation() {
    return this.conversations.victory;
  }

  getCollectibleConversation(collectibleType) {
    const collectibleConversations = {
      'coin': this.conversations.collectible_coin,
      'health_potion': this.conversations.collectible_potion,
      'speed_boost': this.conversations.powerup_speed,
      'damage_boost': this.conversations.powerup_damage
    };
    return collectibleConversations[collectibleType] || null;
  }

  createCustomConversation(id, title, messages) {
    this.conversations[id] = {
      id,
      title,
      messages
    };
  }

  getAllConversations() {
    return this.conversations;
  }
}

export default ConversationManager;
