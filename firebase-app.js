import {analyzePrice} from './analysis.js';
import {firebaseConfig} from './firebase-config.js';
const status=document.createElement('div');
status.id='firebase-status';status.style.cssText='position:fixed;bottom:12px;left:12px;z-index:80;background:#15243b;color:#fff;padding:9px 13px;border:1px solid #46607b;border-radius:10px;font:12px system-ui;max-width:300px';
document.body.appendChild(status);
if(!firebaseConfig.projectId || !firebaseConfig.apiKey){status.textContent='Modo demonstração: configure firebase-config.js para conectar o banco.';}
else {
 try {
  const [{initializeApp},{getFirestore,collection,query,where,limit,onSnapshot,addDoc,getDocs,serverTimestamp},{getAuth,signInAnonymously,onAuthStateChanged}]=await Promise.all([
   import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
   import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js'),
   import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js')]);
  const app=initializeApp(firebaseConfig), db=getFirestore(app), auth=getAuth(app);
  let uid=null;
  onAuthStateChanged(auth,u=>{uid=u?.uid||null});
  // A leitura pública não depende da autenticação anônima.
  const ensureUser=async()=>{if(!auth.currentUser)await signInAnonymously(auth);uid=auth.currentUser.uid};
  let catalogVersion=0;
  onSnapshot(query(collection(db,'products'),where('active','==',true),limit(100)),async snap=>{
   const version=++catalogVersion;
   const data=snap.docs.map(d=>({id:d.id,...d.data()})).filter(p=>typeof p.name==='string'&&Number.isFinite(p.price)&&p.price>0).map(p=>({...p,icon:p.icon||'🛍️',brand:p.brand||'OFERTA',old:p.old||p.ref}));
   products=data;render();
   await Promise.all(data.map(async p=>{try{const history=await window.firebaseGetHistory(p.id);p.analysis=analyzePrice(p,history)}catch{p.analysis={label:'Análise indisponível',reason:'Falha ao consultar histórico. Não é possível comprovar desconto.',discount:0}}}));
   if(version!==catalogVersion)return;
   render();status.textContent=data.length?`Firebase conectado • ${data.length} produtos cadastrados`:'Firebase conectado • nenhum produto cadastrado';
  },err=>{catalogVersion++;products=[];render();status.textContent='Erro ao ler produtos: '+err.code;console.error(err)});
  window.firebaseGetHistory=async productId=>{const snap=await getDocs(query(collection(db,'price_history'),where('productId','==',productId),limit(100)));if(snap.size===100)throw new Error('Histórico excede a amostra; requer consulta paginada.');return snap.docs.map(d=>d.data()).sort((a,b)=>(b.recordedAt?.seconds||0)-(a.recordedAt?.seconds||0))};
  window.firebaseSaveAlert=async(product,target)=>{
   try{await ensureUser()}catch{toast('Não foi possível autenticar para salvar o alerta.');return}
   try{await addDoc(collection(db,'users',uid,'alerts'),{productId:String(product.id),target,createdAt:serverTimestamp(),active:true});closeModal();toast('Alerta salvo no Firebase! O envio automático ainda não está ativo.');}
   catch(e){console.error(e);toast('Não foi possível salvar: '+e.code)}
  };
 }catch(e){console.error(e);status.textContent='Falha na conexão Firebase: '+e.message}
}
