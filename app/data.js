module.exports = [
{
  title: 'Csicsoka kremleves',
  time: [{type: 'prepare', value: 30}, {type: 'cook', value: 30}],
  ingredients:[
    {label: 'csicsoka', quantity: 500, unit: 'g'},
    {label: 'burgonya', quantity: '1 kisebb'},
    {label: 'voroshagyma', quantity: '1 kis fej'},
    {label: 'olaj', quantity: '1', unit: 'evk'},
    {label: 'so'},
    {label: 'bors'},
    {label: 'tarkony'},
    {label: 'petrezselyem'},
    {label: 'ecet', quantity: '1', unit: 'kk'},
    {label: 'tejföl', quantity: '1', unit: 'deci'},
    {label: 'víz', quantity: 0.5, unit: 'lit'}
  ],
  preparation: 'Mindent tisztits meg es keszits elo. Apro kockrakra vagjuk a csicsokat.',
  cooking: `A vajon a hagymat es a csicsokat megfuttatjuk. Felontjuk fel liter vizzel, majd
  beletesszuk a felkockazott krumplit. Soval, orolt borssal, tarkonnyal es petrezselyemzolddel
  izesitjuk.`
},{
  title: 'Langos',
  time: [{type: 'prepare', value: 20}, {type: 'rest', value: 60}, {type: 'fry', value: 15}],
  ingredients:[
    {label: 'finomliszt', quantity: '400', unit: 'g'},
    {label: 'integralliszt', quantity: '80', unit: 'g'},
    {label: 'tej', quantity: '2.5', unit: 'deci'},
    {label: 'sutopor', quantity: '0.5'},
    {label: 'olaj', quantity: '2', unit: 'evk'},
    {label: 'so', quantity: '2', unit: 'kk'},
  ],
  preparation: 'Mindent tisztits meg es keszits elo. Apro kockrakra vagjuk a csicsokat.',
  cooking: `A lisztbe belekeverjük a sót, sütőport, lenmagot, szezámmagot. Beleöntjük az
  olajat, majd a fokozatosan a vizet miközben gyúrjuk. Amikor összeállt, akkor hagyjuk
  pihenni a tésztát. Sütés előtt egy vastag kigyót formálunk, újnyi vastag szeleteket
  vágunk, elnyújtjuk 3-4mm vastagságúra és forró olajban kisütjük. Fokhagymával és sóval fogyasszuk.`
}];
