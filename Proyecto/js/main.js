document.addEventListener('DOMContentLoaded', function() {
  const ticketType = document.getElementById('ticketType');
  const eventDate = document.getElementById('eventDate');
  const numAdults = document.getElementById('numAdults');
  const numChildren = document.getElementById('numChildren');
  const submitBtn = document.getElementById('submitTicketsBtn');

  const ticketTypeError = document.getElementById('ticketTypeError');
  const eventDateError = document.getElementById('eventDateError');
  const numAdultsError = document.getElementById('numAdultsError');
  const numChildrenError = document.getElementById('numChildrenError');

  // Elementos del Modal
  const confirmBookingModal = new bootstrap.Modal(document.getElementById('confirmBookingModal'));
  const modalTicketType = document.getElementById('modalTicketType');
  const modalEventDate = document.getElementById('modalEventDate');
  const modalNumAdults = document.getElementById('modalNumAdults');
  const modalNumChildren = document.getElementById('modalNumChildren');
  const modalSubtotal = document.getElementById('modalSubtotal');
  const modalTotal = document.getElementById('modalTotal');
  const modalAdultsDetail = document.getElementById('modalAdultsDetail');
  const modalChildrenDetail = document.getElementById('modalChildrenDetail');

  // Elementos del Modal de Galería
  const zoneGalleryModal = new bootstrap.Modal(document.getElementById('zoneGalleryModal'));
  const zoneNameInModal = document.getElementById('zoneNameInModal');
  const zoneCarouselInner = document.getElementById('zoneCarouselInner');

  // Precios de entradas
  const ticketPrices = {
    'Pase Básico': { adult: 14990, child: 9990 },
    'Pase Full': { adult: 24990, child: 17990 },
    'Pase Premium': { adult: 44990, child: 32990 }
  };


  function validateForm() {
    let isValid = true;

    // Convierte los valores de adultos y niños a números
    const selectedAdults = parseInt(numAdults.value) || 0; 
    const selectedChildren = parseInt(numChildren.value) || 0; 

    console.log('Validando formulario...');
    console.log('Tipo de Ticket:', ticketType.value);
    console.log('Fecha del Evento:', eventDate.value);
    console.log('Adultos:', selectedAdults);
    console.log('Niños:', selectedChildren);

    // Validar Tipo de Ticket
    if (ticketType.value === 'Elegí tu ticket' || ticketType.value === '') {
      ticketTypeError.textContent = 'Por favor, elige un tipo de ticket.';
      isValid = false;
    } else {
      ticketTypeError.textContent = '';
    }

    // Validar Fecha del Evento
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reiniciar hora para comparar solo fechas
    const selectedDate = new Date(eventDate.value);
    selectedDate.setHours(0, 0, 0, 0);

    if (eventDate.value === '') {
      eventDateError.textContent = 'Por favor, elige una fecha.';
      isValid = false;
    } else if (selectedDate < today) {
      eventDateError.textContent = 'La fecha no puede ser en el pasado.';
      isValid = false;
    } else {
      eventDateError.textContent = '';
    }

    // Validar Número de Adultos y Niños
    if (selectedAdults === 0 && selectedChildren === 0) {
      numAdultsError.textContent = 'Debe seleccionar al menos 1 adulto o niño.';
      numChildrenError.textContent = '';
      isValid = false;
    } else if (selectedChildren >= 1 && selectedAdults === 0) {
      numAdultsError.textContent = 'Si hay niños, debe haber al menos 1 adulto seleccionado.';
      numChildrenError.textContent = '';
      isValid = false;
    } else {
      numAdultsError.textContent = '';
      numChildrenError.textContent = '';
    }

    submitBtn.disabled = !isValid;
    console.log('Formulario válido:', isValid);
    console.log('Botón deshabilitado:', submitBtn.disabled);
    return isValid;
  }

  // Validación inicial al cargar la página
  validateForm();

  // Agregar escuchadores de eventos para cambios en los inputs
  ticketType.addEventListener('change', validateForm);
  eventDate.addEventListener('change', validateForm);
  numAdults.addEventListener('change', validateForm);
  numChildren.addEventListener('change', validateForm);
  
  // Manejar el envío del formulario
  submitBtn.addEventListener('click', function(event) {
    console.log('Botón Conseguí tus tickets! clicado.');
    event.preventDefault(); // Prevenir envío por defecto del formulario
    if (validateForm()) {
      // Releer valores justo antes de llenar el modal para asegurar que estén actualizados
      const currentAdults = parseInt(numAdults.value) || 0;
      const currentChildren = parseInt(numChildren.value) || 0;

      // Llenar el modal con los datos seleccionados
      modalTicketType.textContent = ticketType.options[ticketType.selectedIndex].text;
      modalEventDate.textContent = eventDate.value;

      // Limpiar detalles anteriores
      modalAdultsDetail.textContent = '';
      modalChildrenDetail.textContent = '';

      // Calcular subtotal y total
      const selectedTicketTypeName = ticketType.options[ticketType.selectedIndex].text;
      const prices = ticketPrices[selectedTicketTypeName];

      let subtotal = 0;
      if (prices) {
        const adultPrice = prices.adult;
        const childPrice = prices.child;

        let adultTotal = 0;
        if (currentAdults > 0) {
            adultTotal = currentAdults * adultPrice;
            modalAdultsDetail.textContent = `${currentAdults} Adulto(s) $${adultPrice.toFixed(2)} ARS c/u = $${adultTotal.toFixed(2)} ARS`;
            subtotal += adultTotal;
        }

        let childTotal = 0;
        if (currentChildren > 0) {
            childTotal = currentChildren * childPrice;
            modalChildrenDetail.textContent = `${currentChildren} Niño(s) $${childPrice.toFixed(2)} ARS c/u = $${childTotal.toFixed(2)} ARS`;
            subtotal += childTotal;
        }
      }

      const total = subtotal; // Por ahora, el total es igual al subtotal. Agregar impuestos/descuentos aquí si es necesario.

      modalSubtotal.textContent = total === 0 ? '0.00 ARS' : subtotal.toFixed(2) + ' ARS';
      modalTotal.textContent = total === 0 ? '0.00 ARS' : total.toFixed(2) + ' ARS';
      
      // Mostrar el modal
      confirmBookingModal.show();
    }
  });

  // Establecer fecha mínima para el input de fecha
  eventDate.min = new Date().toISOString().split('T')[0];

  // Desplazamiento suave para enlaces de navegación
  document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Lógica del Interruptor de Modo Oscuro
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Verificar preferencia guardada al cargar la página
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.querySelector('.fas').classList.replace('fa-moon', 'fa-sun');
  } else {
    darkModeToggle.querySelector('.fas').classList.replace('fa-sun', 'fa-moon');
  }

  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('darkMode', 'enabled');
      darkModeToggle.querySelector('.fas').classList.replace('fa-moon', 'fa-sun');
    } else {
      localStorage.setItem('darkMode', 'disabled');
      darkModeToggle.querySelector('.fas').classList.replace('fa-sun', 'fa-moon');
    }
  });

});
