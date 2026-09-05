const CONFIG = {
  cliente: {
    nombre: "NP Style",
    profesion: "Estudio de Belleza · Corte y Color",
    tagline: "Diseños de color, alisados y terapias capilares en Yopal",
    disponible: true,
    verificado: true 
  },
  colores: {
    primary:  "#3B2418", 
    secondary:"#B98A5E", 
    accent:   "#F4EFE3"  
  },
  contacto: {
    telefonoDisplay: "+57 314 539 2108",
    telefonoE164: "+573145392108",
    whatsapp: "573145392108",
    mensajeWhatsapp: "Hola NP Style, vi tu tarjeta digital y quiero agendar una cita.",
    email: "npstyleyopal@gmail.com"
  },
  urlTarjeta: window.location.href,
  redes: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/"
  },
  servicios: [
    { icono:"fa-solid fa-palette", nombre:"Diseños de color", descripcion:"Coloración personalizada según tu tono de piel y estilo." },
    { icono:"fa-solid fa-wand-magic-sparkles", nombre:"Alisados", descripcion:"Alisado profesional con acabado natural y duradero." },
    { icono:"fa-solid fa-spray-can-sparkles", nombre:"Terapia Micro Mist", descripcion:"Tratamiento capilar de hidratación profunda." },
    { icono:"fa-solid fa-scissors", nombre:"Corte", descripcion:"Corte a la medida de tu rostro y estilo de vida." }
  ],
  galeria: [
    { src:"1.jpg", alt:"Balayage rubio NP Style" },
    { src:"2.jpg", alt:"Diseño de color e iluminaciones NP Style" }
  ],
  cobertura: {
    texto: "Atención exclusiva en nuestro estudio profesional en Yopal.",
    zonas: ["Yopal", "Casanare", "Sogamoso (Citas especiales)"]
  },
  informacion: {
    horario: "Mar – Sáb: 8:00 AM – 7:00 PM | Dom por cita previa",
    direccion: "Yopal, Casanare, Colombia"
  }
};

(function(){
  "use strict";

  // Inyección de servicios
  const listaServicios = document.getElementById('lista-servicios');
  CONFIG.servicios.forEach(s=>{
    listaServicios.insertAdjacentHTML('beforeend', `
      <div class="servicio-item">
        <div class="ic"><i class="${s.icono}"></i></div>
        <div><h3>${s.nombre}</h3><p>${s.descripcion}</p></div>
      </div>`);
  });

  // Inyección de galería apuntando a la raíz del repositorio
  const wrapper = document.getElementById('swiper-wrapper');
  CONFIG.galeria.forEach(g=>{
    wrapper.insertAdjacentHTML('beforeend', `<div class="swiper-slide"><img src="${g.src}" alt="${g.alt}" loading="lazy"></div>`);
  });

  // Inyección de Cobertura
  document.getElementById('cobertura-texto').textContent = CONFIG.cobertura.texto;
  const chips = document.getElementById('cobertura-chips');
  CONFIG.cobertura.zonas.forEach(z=>{
    chips.insertAdjacentHTML('beforeend', `<span class="chip">${z}</span>`);
  });

  // Inyección de Información
  const listaInfo = document.getElementById('lista-informacion');
  if(CONFIG.informacion.horario) listaInfo.insertAdjacentHTML('beforeend', `<div class="info-row"><span class="ic"><i class="fa-regular fa-clock"></i></span>${CONFIG.informacion.horario}</div>`);
  if(CONFIG.informacion.direccion) listaInfo.insertAdjacentHTML('beforeend', `<div class="info-row"><span class="ic"><i class="fa-solid fa-location-dot"></i></span>${CONFIG.informacion.direccion}</div>`);
  if(CONFIG.contacto.email) listaInfo.insertAdjacentHTML('beforeend', `<div class="info-row"><span class="ic"><i class="fa-regular fa-envelope"></i></span>${CONFIG.contacto.email}</div>`);

  // Inyección de Redes
  const redesRow = document.getElementById('redes-row');
  if(CONFIG.redes.instagram) redesRow.insertAdjacentHTML('beforeend', `<a href="${CONFIG.redes.instagram}" target="_blank" class="social-btn"><i class="fa-brands fa-instagram"></i></a>`);
  if(CONFIG.redes.facebook) redesRow.insertAdjacentHTML('beforeend', `<a href="${CONFIG.redes.facebook}" target="_blank" class="social-btn"><i class="fa-brands fa-facebook-f"></i></a>`);

  // Acciones globales
  function accionWhatsApp(){
    window.open(`https://wa.me/${CONFIG.contacto.whatsapp}?text=${encodeURIComponent(CONFIG.contacto.mensajeWhatsapp)}`, '_blank');
  }
  function accionLlamar(){
    window.location.href = `tel:${CONFIG.contacto.telefonoE164}`;
  }
  function accionGuardarContacto(){
    const v = ["BEGIN:VCARD","VERSION:3.0",`FN:${CONFIG.cliente.nombre}`,`TITLE:${CONFIG.cliente.profesion}`,`TEL;TYPE=CELL:${CONFIG.contacto.telefonoE164}`,`URL:${CONFIG.urlTarjeta}`,"END:VCARD"].join("\n");
    const blob = new Blob([v], {type:"text/vcard"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `NP_Style.vcf`;
    document.body.appendChild(a); a.click(); a.remove();
    mostrarToast("Contacto descargado");
  }
  
  let swiperInstance = null;
  function abrirModal(id){
    document.getElementById(id).classList.add('is-open');
    if(id === 'modal-galeria' && !swiperInstance){
      swiperInstance = new Swiper('#swiper-galeria', { loop:true, spaceBetween:10, autoplay:{delay:3000} });
    }
  }
  function cerrarModal(modalEl){ modalEl.classList.remove('is-open'); }

  document.addEventListener('click', function(e){
    const btnAction = e.target.closest('[data-action]');
    if(btnAction){
      const act = btnAction.dataset.action;
      if(act === 'whatsapp') accionWhatsApp();
      if(act === 'llamar') accionLlamar();
      if(act === 'guardar') accionGuardarContacto();
      if(act === 'copiar-link'){ navigator.clipboard.writeText(CONFIG.urlTarjeta); mostrarToast("Vínculo copiado"); }
      if(act === 'compartir'){
        abrirModal('modal-compartir');
        const qrEl = document.getElementById('qr-code');
        if(!qrEl.dataset.rendered){
          new QRCode(qrEl, { text: CONFIG.urlTarjeta, width:140, height:140, colorDark: CONFIG.colores.primary });
          qrEl.dataset.rendered = "1";
        }
      }
    }
    const btnModal = e.target.closest('[data-modal]');
    if(btnModal) abrirModal(btnAction ? btnAction.dataset.modal : btnModal.dataset.modal);
    if(e.target.closest('[data-close]') || e.target.hasAttribute('data-modal-root')) cerrarModal(e.target.closest('[data-modal-root]'));
  });

  function mostrarToast(msg){
    const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('is-visible');
    setTimeout(()=> t.classList.remove('is-visible'), 2200);
  }

  window.addEventListener('load', () => {
    setTimeout(()=> document.getElementById('splash').classList.add('is-hidden'), 800);
  });
})();
