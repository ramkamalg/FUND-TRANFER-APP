const firebaseConfig = {
    apiKey: "AIzaSyAXH5VZVikX7BUZ3g0E014F37da2favq8k",
    authDomain: "nigerianbereweriesoutlet.firebaseapp.com",
    projectId: "nigerianbereweriesoutlet",
    storageBucket: "nigerianbereweriesoutlet.appspot.com",
    messagingSenderId: "79760620230",
    appId: "1:79760620230:web:cdbd423673813ae5ad75c7"
  };
    firebase.initializeApp(firebaseConfig);

const regModel = document.getElementById('openRegisterModel')
const modal = document.getElementById('modal')
const closeModel = document.getElementById('closeRegistermodel');
const registerForm = document.getElementById('registration-form');

const PreferredDay = document.getElementById("PreferredDay");
const Country = document.getElementById('Country');
const showRegModel = () => {
    modal.classList.toggle('is-active')
}



regModel.addEventListener('click', showRegModel)


closeModel.addEventListener('click', showRegModel)
registerForm.addEventListener('submit', (e) =>{
  e.preventDefault();
});

var x = document.getElementById("Latitude");
var y = document.getElementById("Longitude");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
    // document.getElementById("mytext").value = "My value";
  x.value =  position.coords.latitude ;
  y.value = position.coords.longitude;
}

////////////////////ready data//////////////////////////////

// console.log(option.value);

var  initialTitle, PreferredDayVisit,CountryTrade,firstName,middleName,lastName,Code,phone,state,lga,City,Country2,Zone,Region,SalesArea,Territory,SectorCluster,Section,
Classification,VisitFrequency,Latitude,Longitude,houseNo,Street1,Street2,Street3,RelationshipType,SubChannel,Channel,visit;
//////// ready data//////////////////
function Ready(){
    
    var select = document.getElementById('titleOUTLET');
    var option = select.options[select.selectedIndex];
    // console.log(option.value);
    initialTitle = option.value;
    // console.log(initialTitle);
    var Prefer = document.getElementById('PreferredDay');
    var daySelected = Prefer.options[Prefer.selectedIndex];
    // console.log(daySelected.value);
    PreferredDayVisit = daySelected.value;

    var segment = document.getElementById('BusinessSegment');
    var businessSeg = segment.options[segment.selectedIndex];
    // console.log(businessSeg.value);
    CountryTrade = businessSeg.value;


    firstName  = document.getElementById('firstName').value;
    middleName = document.getElementById('middleName').value;
    lastName = document.getElementById('lastName').value;
    Code = document.getElementById('Code').value;
    phone = document.getElementById('phone').value;
    state = document.getElementById('state').value;
    lga = document.getElementById('lga').value;
    City = document.getElementById('City').value;
    Country2 = document.getElementById('Country2').value;
    Zone = document.getElementById('Zone').value;
    Region = document.getElementById('Region').value;
    SalesArea = document.getElementById('SalesArea').value;
    Territory = document.getElementById('Territory').value;
    SectorCluster = document.getElementById('SectorCluster').value;
    Section = document.getElementById('Section').value;
  Classification = document.getElementById('Classification').value;
  VisitFrequency = document.getElementById('VisitFrequency').value;
  Latitude = document.getElementById('Latitude').value;
  Longitude = document.getElementById('Longitude').value;
  houseNo = document.getElementById('houseNo').value;
  Street1 = document.getElementById('Street1').value;
  Street2 = document.getElementById('Street2').value;
  Street3 = document.getElementById('Street3').value;
  RelationshipType = document.getElementById('RelationshipType').value;
  SubChannel = document.getElementById('SubChannel').value;
  Channel = document.getElementById('Channel').value;
  visit = document.getElementById('visit').value;
 
 
  

}
/////////////////////////////////////////////////////
function Ready2(){
    
    // var select = document.getElementById('titleOUTLET');
    // var option = select.options[select.selectedIndex];
    // // console.log(option.value);
    // initialTitle = option.value;
    // // console.log(initialTitle);
    // var Prefer = document.getElementById('PreferredDay');
    // var daySelected = Prefer.options[Prefer.selectedIndex];
    // // console.log(daySelected.value);
    // PreferredDayVisit = daySelected.value;

    // var segment = document.getElementById('BusinessSegment');
    // var businessSeg = segment.options[segment.selectedIndex];
    // // console.log(businessSeg.value);
    // CountryTrade = businessSeg.value;


    firstName  = document.getElementById('firstName').value;
    middleName = document.getElementById('middleName').value;
    lastName = document.getElementById('lastName').value;
    Code = document.getElementById('Code').value;
    phone = document.getElementById('phone').value;
    state = document.getElementById('state').value;
    lga = document.getElementById('lga').value;
    City = document.getElementById('City').value;
    Country2 = document.getElementById('Country2').value;
    Zone = document.getElementById('Zone').value;
    Region = document.getElementById('Region').value;
    SalesArea = document.getElementById('SalesArea').value;
    Territory = document.getElementById('Territory').value;
    SectorCluster = document.getElementById('SectorCluster').value;
    Section = document.getElementById('Section').value;
  Classification = document.getElementById('Classification').value;
  VisitFrequency = document.getElementById('VisitFrequency').value;
  Latitude = document.getElementById('Latitude').value;
  Longitude = document.getElementById('Longitude').value;
  houseNo = document.getElementById('houseNo').value;
  Street1 = document.getElementById('Street1').value;
  Street2 = document.getElementById('Street2').value;
  Street3 = document.getElementById('Street3').value;
  RelationshipType = document.getElementById('RelationshipType').value;
  SubChannel = document.getElementById('SubChannel').value;
  Channel = document.getElementById('Channel').value;
  visit = document.getElementById('visit').value;
 
 
  

}





//////////////// save record//////////////////////
document.getElementById('saveREC').onclick = function(){
   Ready();
   firebase.database().ref('OutletInfo/'+Code).set({
      Title: initialTitle,
      PreferredDay:PreferredDay,
      Country:CountryTrade,
      firstName : firstName,
   middleName :  middleName,
  lastName : lastName,
  Code : Code,
  phone : phone,
  state : state,
  lga : lga,
   City :  City,
  Country2 : Country2,
  Zone : Zone,
  Region : Region,
  SalesArea : SalesArea,
  Territory : Territory,
   SectorCluster :  SectorCluster,
  Section : Section,
  Classification : Classification,
  VisitFrequency : VisitFrequency,
  Latitude : Latitude,
   Longitude :  Longitude,
   houseNo :  houseNo,
   Street1 :  Street1,
   Street2 :  Street2,
   Street3 :  Street3,
  RelationshipType : RelationshipType,
  SubChannel : SubChannel,
   Channel :  Channel,
  visit : visit,


 

   });

    alert("Record save successfully");

   
}

//////// search record///////////////////////////
document.getElementById('select').onclick = function(){
  Ready();
  firebase.database().ref('OutletInfo/'+Code).on('value', function(snapshot){
    document.getElementById('titleOUTLET').value = snapshot.val().Title;
    document.getElementById('PreferredDay').value = snapshot.val().PreferredDay;
    document.getElementById('BusinessSegment').value = snapshot.val(). Country;
    document.getElementById('firstName').value = snapshot.val().firstName;
    document.getElementById('middleName').value = snapshot.val().middleName;
    document.getElementById('lastName').value = snapshot.val().lastName;
    document.getElementById('Code').value = snapshot.val().Code ;
    document.getElementById('phone').value = snapshot.val().phone;
    document.getElementById('state').value = snapshot.val().state;
    document.getElementById('lga').value = snapshot.val().lga;
    document.getElementById('City').value = snapshot.val().City;
    document.getElementById('Country2').value = snapshot.val().Country2;
    document.getElementById('Zone').value = snapshot.val().Zone;
    document.getElementById('Region').value = snapshot.val().Region;
    document.getElementById('SalesArea').value = snapshot.val().SalesArea;
    document.getElementById('Territory').value = snapshot.val().Territory;
    document.getElementById('SectorCluster').value = snapshot.val().SectorCluster;
    document.getElementById('Section').value = snapshot.val().Section;
    document.getElementById('Classification').value = snapshot.val().Classification;
    document.getElementById('VisitFrequency').value = snapshot.val().VisitFrequency;
    document.getElementById('Latitude').value = snapshot.val().Latitude;
    document.getElementById('Longitude').value = snapshot.val().Longitude;
    document.getElementById('houseNo').value = snapshot.val().houseNo;
    document.getElementById('Street1').value = snapshot.val().Street1;
    document.getElementById('Street2').value = snapshot.val().Street2;
    document.getElementById('Street3').value = snapshot.val().Street3;
    document.getElementById('RelationshipType').value = snapshot.val().RelationshipType;
    document.getElementById('SubChannel').value = snapshot.val().SubChannel;
    document.getElementById('Channel').value = snapshot.val().Channel;
    document.getElementById('visit').value = snapshot.val().visit;

  });
}

////////////////////////////////////////////

//////////////// update record//////////////////////
      document.getElementById('updateREC').onclick = function(){
         Ready2();
         firebase.database().ref('OutletInfo/'+Code).update({
            // Title: initialTitle,
            // PreferredDay:PreferredDay,
            // Country:CountryTrade,
            firstName : firstName,
         middleName :  middleName,
        lastName : lastName,
        // Code : Code,
        phone : phone,
        state : state,
        lga : lga,
         City :  City,
        Country2 : Country2,
        Zone : Zone,
        Region : Region,
        SalesArea : SalesArea,
        Territory : Territory,
         SectorCluster :  SectorCluster,
        Section : Section,
        Classification : Classification,
        VisitFrequency : VisitFrequency,
        Latitude : Latitude,
         Longitude :  Longitude,
         houseNo :  houseNo,
         Street1 :  Street1,
         Street2 :  Street2,
         Street3 :  Street3,
        RelationshipType : RelationshipType,
        SubChannel : SubChannel,
         Channel :  Channel,
        visit : visit,


       

         });

        

   
}

const statusEl = document.getElementById('statusMessage');
const balanceEl = document.getElementById('balanceDisplay');
const userDisplayEl = document.getElementById('userDisplay');
const txBodyEl = document.getElementById('txBody');
const transferBtn = document.getElementById('transferBtn');
const refreshBtn = document.getElementById('refreshBtn');

const currencyFormatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
const formatAmount = (val, fallback) => {
  const numeric = Number(val);
  if (!Number.isFinite(numeric)) return fallback || val;
  try {
    return currencyFormatter.format(numeric);
  } catch (_) {
    return numeric.toFixed(2);
  }
};

function setStatus(message, type = 'is-info') {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = `notification ${type}`;
  statusEl.classList.remove('is-hidden');
}

function clearStatus() {
  if (!statusEl) return;
  statusEl.classList.add('is-hidden');
  statusEl.textContent = '';
}

function handleUnauthorized() {
  localStorage.removeItem('ft_token');
  window.location.href = 'loginpage.html';
}

async function api(path, opts = {}) {
  const token = localStorage.getItem('ft_token');
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(path, Object.assign({}, opts, { headers }));
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }
  return res;
}

function renderTransactions(transactions) {
  if (!txBodyEl) return;
  if (!transactions || transactions.length === 0) {
    txBodyEl.innerHTML = '<tr><td colspan="6">No transactions yet.</td></tr>';
    return;
  }
  const rows = transactions.map((tx, index) => {
    const amount = tx.amountFormatted || formatAmount(tx.amount, tx.amount);
    const directionTag = tx.direction === 'outgoing'
      ? '<span class="tag is-warning">Sent</span>'
      : '<span class="tag is-success">Received</span>';
    const date = tx.createdAtISO ? new Date(tx.createdAtISO).toLocaleString() : tx.createdAt;
    const note = tx.note ? tx.note.replace(/</g, '&lt;') : '';
    return `<tr>
      <td>${index + 1}</td>
      <td>${directionTag}</td>
      <td>${tx.counterparty || '—'}</td>
      <td>${amount}</td>
      <td>${note}</td>
      <td>${date}</td>
    </tr>`;
  });
  txBodyEl.innerHTML = rows.join('');
}

async function loadProfile() {
  try {
    const res = await api('/api/me');
    const data = await res.json();
    const user = data.user || {};
    if (userDisplayEl) {
      userDisplayEl.textContent = user.username || user.email || 'Unknown user';
    }
    if (balanceEl) {
      const formatted = formatAmount(user.balance, user.balance);
      balanceEl.textContent = `Balance: ${formatted}`;
    }
  } catch (err) {
    console.error(err);
    setStatus('Unable to load profile details.', 'is-danger');
  }
}

async function loadTransactions() {
  try {
    const res = await api('/api/transactions');
    const data = await res.json();
    renderTransactions(data.transactions);
  } catch (err) {
    console.error(err);
    setStatus('Unable to load transactions.', 'is-danger');
  }
}

async function submitTransfer() {
  if (!transferBtn) return;
  const to_account = document.getElementById('to_account').value.trim();
  const amount = Number(document.getElementById('amount').value);
  const note = document.getElementById('note').value.trim();

  if (!to_account || !Number.isFinite(amount) || amount <= 0) {
    setStatus('Please supply a valid recipient and amount greater than zero.', 'is-warning');
    return;
  }

  transferBtn.disabled = true;
  clearStatus();
  try {
    const res = await api('/api/transfer', {
      method: 'POST',
      body: JSON.stringify({ to_account, amount, note })
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || 'Transfer failed.', 'is-danger');
    } else {
      setStatus(`Transfer successful. New balance: ${data.balanceFormatted || formatAmount(data.balance)}`, 'is-success');
      document.getElementById('amount').value = '';
      document.getElementById('note').value = '';
      await loadProfile();
      await loadTransactions();
    }
  } catch (err) {
    console.error(err);
    setStatus('Network error while attempting transfer.', 'is-danger');
  } finally {
    transferBtn.disabled = false;
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadProfile();
  await loadTransactions();

  if (transferBtn) {
    transferBtn.addEventListener('click', submitTransfer);
  }
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      clearStatus();
      await loadProfile();
      await loadTransactions();
    });
  }
});