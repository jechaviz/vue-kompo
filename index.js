import {VueMasonryPlugin} from 'vue-masonry'
import TurboClick from './js/core/TurboClick'

require('./js/core/bootstrap')

window._kompo = {
    echo : [], //used to stop listeners on turboclick
    komponents: [], //used to stop refreshing komponents
    sessionTimeoutMessage: '',
    history: [window.location.href],
    toggleSpinner: function(display){
        let spinner = document.getElementById('vl-spinner')
        if (spinner) {
            spinner.style.display = display
        }       
    }
}

const Kompo = {
  	install (Vue, options = {}) {

  		const files = require.context('./js/', true, /\.vue$/i)
		files.keys().map(key => Vue.component('Vl'+key.split('/').pop().split('.')[0], files(key).default))

    	this.events = new Vue()
		
		Vue.use(VueMasonryPlugin)

		Vue.prototype.$kompo = {
			vlEmitFrom(kompoid, event, parameters){
				Kompo.events.$emit('vlEmit'+kompoid, event, parameters)
			},
			vlSort(kompoid, sortValue, emitterId){
				Kompo.events.$emit('vlSort'+kompoid, sortValue, emitterId)
			},
			vlPreview(kompoid, index){
				Kompo.events.$emit('vlPreview'+kompoid, index)
			},
			vlPreSubmit(kompoid){
	    		Kompo.events.$emit('vlPreSubmit'+kompoid)
	    	},
			vlSubmitSuccess(kompoid, response, submitElement){
	    		Kompo.events.$emit('vlSubmitSuccess'+kompoid, response, submitElement)
	    	},
			vlSubmitError(kompoid, error){
	    		Kompo.events.$emit('vlSubmitError'+kompoid, error)
	    	},
	    	vlReloadAfterChildAction(kompoid){
	    		Kompo.events.$emit('vlReloadAfterChildAction'+kompoid)
	    	},
			vlBrowseQuery(kompoid, page, initialFilter){
	    		Kompo.events.$emit('vlBrowseQuery'+kompoid, page, initialFilter)
	    	},
			vlRemoveItem(kompoid, index){
	    		Kompo.events.$emit('vlRemoveItem'+kompoid, index)
	    	},
	    	vlRefreshKomponent(kompoid, responseData){
	    		Kompo.events.$emit('vlRefreshKomponent'+kompoid, responseData)
	    	},
	    	vlLoadItems(kompoid, responseData){
	    		Kompo.events.$emit('vlLoadItems'+kompoid, responseData)
	    	},
	    	vlToggle(kompoid, toggleId){
	    		Kompo.events.$emit('vlToggle'+kompoid, toggleId)
	    	},
	    	vlUpdateErrorState(kompoid){
	    		Kompo.events.$emit('vlUpdateErrorState'+kompoid)
	    	},
	    	vlDeliverJsonFormData(kompoid, toComponentId){
	    		Kompo.events.$emit('vlDeliverJsonFormData'+kompoid, toComponentId)
	    	},
	    	vlRequestFieldValue(kompoid, field_name, toComponentId){
	    		Kompo.events.$emit('vlRequestFieldValue'+kompoid+field_name, toComponentId)
	    	},
	    	vlSetFieldValue(receiverId, value){
	    		Kompo.events.$emit('vlSetFieldValue'+receiverId, value)
	    	},
	    	vlToggleSubmit(kompoid, canSubmit){
	    		Kompo.events.$emit('vlToggleSubmit'+kompoid, canSubmit)
	    	},
	    	vlFillPanel(panelId, response, included){
	    		Kompo.events.$emit('vlFillPanel'+panelId, response, included)
	    	},
	    	vlFillDrawer(response, kompoid, warnbeforeclose){
	    		Kompo.events.$emit('vlFillDrawer', response, kompoid, warnbeforeclose)
	    	},
	    	vlCloseDrawer(){
	    		Kompo.events.$emit('vlCloseDrawer')
	    	},
	    	vlFillPopup(response){
	    		Kompo.events.$emit('vlFillPopup', response)
	    	},
	    	vlClosePopup(){
	    		Kompo.events.$emit('vlClosePopup')
	    	},
	    	vlRequestKomponentInfo(kompoid, askerId, options){
	    		Kompo.events.$emit('vlRequestKomponentInfo'+kompoid, askerId, options)
	    	},
	    	vlDeliverKomponentInfo(askerId, senderId, komponentInfo){
	    		Kompo.events.$emit('vlDeliverKomponentInfo'+askerId, senderId, komponentInfo)
	    	},
	    	vlGetKomponentInfo(komponentId, askerId){
	    		Kompo.events.$emit('vlGetKomponentInfo'+komponentId, askerId)
	    	},
	    	vlDeliverKompoInfo(askerId, kompoInfo){
	    		Kompo.events.$emit('vlDeliverKompoInfo'+askerId, kompoInfo)
	    	},
			vlToggleSidebar(sidebar, elKompoId){
				Kompo.events.$emit('vlToggleSidebar'+sidebar, elKompoId)
			},
			vlToggleSidebarToggler(kompoid){
				Kompo.events.$emit('vlToggleSidebarToggler'+kompoid)
			},
	    	vlModalShow(modal, ajaxContent, warnbeforeclose, confirmFunc){
	    		Kompo.events.$emit('vlModalShow' + modal, ajaxContent, warnbeforeclose, confirmFunc)
	    	},
	    	vlModalClose(modal){
	    		Kompo.events.$emit('vlModalClose' + modal)
	    	},
	    	vlModalShowFill(modal, html){
	    		Kompo.events.$emit('vlModalShowFill' + modal, html)
	    	},
	    	vlModalInsert(kompoid, componentProps, modalProps){
	    		Kompo.events.$emit('vlModalInsert' + kompoid, componentProps, modalProps)
	    	},
	    	vlAlertShow(alert){
	    		Kompo.events.$emit('vlAlertShow', alert)
	    	},
	    	events : this.events
	    }

    	Vue.directive('click-out', {
			bind: function (el, binding, vnode) {
				el.clickOutsideEvent = function (event) {
					if (!(el == event.target || el.contains(event.target))) 
					    vnode.context[binding.expression](event)
				}
				document.body.addEventListener('click', el.clickOutsideEvent)
			},
			unbind: function (el) {
				document.body.removeEventListener('click', el.clickOutsideEvent)
			}
		})

		Vue.directive('turbo-click', {
			bind: function (el, binding, vnode) {
				el.turboClickEvent = function (e) {

					if(el.href == 'javascript:void(0)' || el.target == '_blank' || e.ctrlKey)
						return

					if(el == e.target || el.contains(e.target)){

						var url = el.href.split('#'),
							currentUrl = window.location.href.replace(window.location.hash, '')
						if(url.length == 2 && url[0] == currentUrl)
							return

						e.preventDefault()

						new TurboClick(vnode, el.href).trigger()
			        }
				}

				if(binding.value !== false) //when v-turbo-click="false" don't bind
					el.addEventListener('click', el.turboClickEvent)
			},
			unbind: function (el) {
				el.removeEventListener('click', el.turboClickEvent)
			}
		})

		//intercept laravel dd()
		window.axios.interceptors.response.use(function (response) {
			// Status code within the range of 2xx

			let r = response.data

		    if(_.isString(r) && !!r.match(/<script>Sfdump\(".+"\)<\/script>/)){
				
		        Kompo.events.$kompo.vlModalShowFill(
		        	'vlDefaultModal', 
		        	'<iframe height="600" width="768" srcdoc="'+r.replace(/"/g, '&quot;')+'"></iframe>'
		        )

		        throw new axios.Cancel('Operation canceled by dump.')

		    }else{
				return response;
		    }
		}, function (error) {
			// Status codes outside the range of 2xx
			let r = error.response.data

		    if(_.isString(r) && !!r.match(/<script>Sfdump\(".+"\)<\/script>/)){
				
		        Kompo.events.$kompo.vlModalShowFill(
		        	'vlDefaultModal', 
		        	'<iframe height="600" width="768" srcdoc="'+r.replace(/"/g, '&quot;')+'"></iframe>'
		        )

		        throw new axios.Cancel('Operation canceled by dump.')

		    }else{
				return Promise.reject(error);
		    }
		});

	}
}
export default Kompo;

Vue.use(Kompo)