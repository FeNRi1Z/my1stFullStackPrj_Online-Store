import '../styles/MyModal.css';

function MyModal(props) {
    return <>
        <div class="modal fade" tabindex="-1" id={props.id}> 
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" style={{fontWeight:'bold'}}>{props.title}</h5>
                        <button id={props.id + '_btnClose'} 
                                type="button" 
                                class="btn-close-custom" 
                                data-dismiss="modal" 
                                aria-label="Close">
                            <i className="fa fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>{props.children}</p>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default MyModal;