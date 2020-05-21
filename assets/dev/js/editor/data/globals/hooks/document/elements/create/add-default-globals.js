import After from 'elementor-api/modules/hooks/data/after';

export class ElementsCreateAddDefaultGlobals extends After {
	getCommand() {
		return 'document/elements/create';
	}

	getConditions( args, result ) {
		// TODO: Remove - Create testing compatibility.
		return ! elementorCommonConfig.isTesting;
	}

	getId() {
		return 'document/elements/create::add-default-globals';
	}

	apply( args, result ) {
		const containers = Array.isArray( result ) ? result : [ result ];

		containers.forEach( ( /* Container */ container ) => {
			Object.entries( container.controls ).forEach( ( [ controlName, control ] ) => {
				if ( control.globals ) {
					const element = container.model.toJSON();

					if ( ! element.settings.__globals__ ) {
						element.settings.__globals__ = {};
					}

					element.settings.__globals__[ controlName ] = control.globals;

					const component = $e.components.get( 'editor/documents' ),
						command = 'editor/documents/:documentId/elements/:elementId',
						query = {
							documentId: container.document.id,
							elementId: element.id,
						};

					$e.data.loadCache( component, command, query, element );
				}
			} );
		} );
	}
}

export default ElementsCreateAddDefaultGlobals;