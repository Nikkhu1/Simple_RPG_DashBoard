import { useState } from "react"

export default function Report() {

    const [Hvalue, setHvalue] = useState(100)
    const [Avalue, setAvalue] = useState(100)
    const [Evalue, setEvalue] = useState(200)
    const [enemyhealth, setenemyhealth] = useState(Math.floor(Math.random() * (150 - 120 + 1)) + 120)
    const [attackLog , setattackLog] = useState([])
    const [turnCount , setturnCount] = useState(1)
    const [Inventory , setInventory] = useState([
    {
      id : 1 ,
      item : 'Health Potion',
      amount : 5
    },
    {
      id : 2 ,
      item : 'Armor Plate',
      amount : 5
    },
    {
      id : 3 ,
      item : 'Energy Potion',
      amount : 5
    }
  ])
  
    const Gameover = Hvalue <= 0;
    const victory = enemyhealth <= 0;

    const gameEnd = Gameover || victory;

  return (
    <>
    <QuestLog />

    <Stats
      valueName = {'Health'}
      Value = {Hvalue}
      setvalue = {setHvalue}
      Limit = {100}
      exception_value = {10}
      gameEnd = {gameEnd}
      Inventory = {Inventory}
      setInventory = {setInventory}
      itemID = {1}
    />

    <Stats
      valueName = {'Armor'}
      Value = {Avalue}
      setvalue = {setAvalue}
      Limit = {100}
      exception_value = {10}
      gameEnd = {gameEnd}
      Inventory = {Inventory}
      setInventory = {setInventory}
      itemID = {2}
    />

    <Stats
      valueName = {'Energy'}
      Value = {Evalue}
      setvalue = {setEvalue}
      Limit = {200}
      exception_value = {10}
      gameEnd = {gameEnd}
      Inventory = {Inventory}
      setInventory = {setInventory}
      itemID = {3}
    />

    <Enemy
      Hvalue = {Hvalue}
      setHvalue = {setHvalue}
      enemyhealth = {enemyhealth}
      setenemyhealth = {setenemyhealth}
      Avalue = {Avalue}
      setAvalue = {setAvalue}
      Gameover = {Gameover}
      victory = {victory}
      attackLog = {attackLog}
      setattackLog = {setattackLog}
      setturnCount = {setturnCount}
    />

    {(Gameover || victory) && <RestartBattle
      setHvalue = {setHvalue}
      setAvalue = {setAvalue}
      setEvalue = {setEvalue}
      setenemyhealth = {setenemyhealth}
      Avalue = {Avalue}
      setturnCount = {setturnCount}
      setattackLog = {setattackLog}
      Inventory = {Inventory}
      setInventory = {setInventory}
    />
    }

    <h4>Turn : {turnCount}</h4>

    <button onClick={() => {setattackLog([])}}>ClearLog</button>

    <DisplayLog 
      attackLog = {attackLog}
    />
    </>
  )
}

function QuestLog() {
  const [questDesc , setquestDesc] = useState("")
  const [questItems , setquestItems] = useState([])
  
  const [editingKey , seteditingKey] = useState(null)
  const [editDesc , seteditDesc] = useState('')

  function AddQuest() {
    if(questDesc.trim()){
      setquestItems(prevItems => [...prevItems , {key : crypto.randomUUID() , desc : questDesc}])
      setquestDesc("")
    }
  }

  function RemoveQuest(key) {
    const tempQuest = questItems.filter(item => item.key !== key)
    setquestItems(tempQuest)
  }

  function StartEdit(key , desc) {
    seteditingKey(key)
    seteditDesc(desc)

  }

  function SaveEdit() {
    if (!editDesc.trim()) return;

    const updatedList = questItems.map(item => (
      editingKey === item.key ?
       {...item , desc : editDesc}
       :
       item
    ))
    setquestItems(updatedList)
    seteditingKey(null)
    seteditDesc('')
    
  }

  function CancelEdit() {
    seteditingKey(null)
    seteditDesc('')
  }

  return (
    <>
      <h3>Quests</h3>
      <input 
        type="text"
        value={questDesc}
        onChange={(e) => setquestDesc(e.target.value)}
        />
      <button onClick={AddQuest}>ADD</button>
      <ul>
        {questItems.map(item => (
          <li key={item.key}>
            {editingKey === item.key ?
              <>
                <input type="text" 
                  value={editDesc}
                  onChange={(e) => seteditDesc(e.target.value)}
                  />
                <button onClick={SaveEdit}>Save</button> 
                <button onClick={CancelEdit}>Cancel</button>
              </> 
                :
              <>
                {item.desc}
                <button onClick={() => StartEdit(item.key , item.desc)}>Edit</button>
                <button onClick={() => RemoveQuest(item.key)}>Remove</button>
              </>
            }
          </li>))}
      </ul>
    </>
  )
}

function DisplayLog({attackLog}) {
  return (
    <ul>
      {attackLog.map(log => (<li key={log.key}>{log.desc}</li>))}
    </ul>
  )
}

function RestartBattle(props){
  function Restart() {
    props.setHvalue(100)
    props.setAvalue(100)
    props.setEvalue(200)
    props.setenemyhealth(Math.floor(Math.random() * (150 - 120 + 1)) + 120)
    props.setturnCount(1)
    props.setattackLog([])

    const updatedInventory = props.Inventory.map(item => {return {...item , amount : 5}})

    props.setInventory(updatedInventory)
  }
  return <button onClick={Restart}>Restart battle</button>
}

function Stats({valueName , Value , setvalue, Limit , exception_value , gameEnd , Inventory , setInventory , itemID}) {
  const Item = Inventory.find(item => item.id === itemID);
  
  function InventoryValue() {

    if( Value < Limit && Item && Item.amount > 0){
      const temp = Value + exception_value;

      setvalue(temp > Limit ? Limit : temp);

      const updatedInventory = Inventory.map(item => {
        if(item.id === itemID){
         return {...item , amount : item.amount - 1}
        }
        else {
          return item
        }
      })

      setInventory(updatedInventory)
    }
  }
  return (
    <>
      <p>{valueName} : {Value}</p>
      {!gameEnd && <button onClick={InventoryValue}>{Item.item} : {Item.amount}</button>} 
    </>
  )
}

function Enemy({Hvalue , setHvalue , enemyhealth , setenemyhealth , Avalue , setAvalue , Gameover , victory , attackLog , setattackLog , setturnCount}) {

  function Attack() {
    if(enemyhealth > 0){
      setturnCount(prevcount => prevcount + 1);
      const damageHit = (Math.floor(Math.random() * (20 - 8 + 1)) + 8);
      const temphealth = enemyhealth - damageHit;
      let enemyLog = {key : crypto.randomUUID() , desc : 'Player Deals ' + damageHit + ' damage to the enemy'};

      setenemyhealth(temphealth < 0 ? 0 : temphealth);
      {temphealth <= 0 && setattackLog(prevLog => [...prevLog , enemyLog])}
      if(temphealth > 0){
        const damageTook = Math.floor(Math.random() * 16) + 12;

        const absorbed = Math.min(Avalue, damageTook);
        const overflow = damageTook - absorbed;

        setAvalue(Avalue - absorbed);
        setHvalue(Math.max(0, Hvalue - overflow));
        let playerLog = {key : crypto.randomUUID() ,desc : 'Player receives ' + overflow + ' damage from enemy ( absorbed ' + absorbed + ' damage by armor)'};
        setattackLog([...attackLog , enemyLog , playerLog]);
      }
    }
  }

  return(
  <>
    <p>Enemy Health : {enemyhealth}</p>
    {Gameover ? 
        <p>You Lost</p> :
      victory ?
        <p>Enemy defeated</p> :
        <button onClick={Attack}>Attack</button> 
    }
    
  </>
  )
}