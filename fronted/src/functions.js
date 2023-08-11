import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function show_alert(mensaje, icono){
    // onfocus(foco);
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: mensaje,
        icon: icono
    });
}

// function onfocus(foco){
//     if(foco !== undefined){
//         document.getElementById(foco).focus();
//     }
// }