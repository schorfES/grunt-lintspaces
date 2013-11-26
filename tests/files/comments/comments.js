/*
 * This is a multiline comment.
 */
(function() {
    var
        foo = 'baz',
        bar
        ;

    /*
     * This is a multiline comment with a python multiline comment inside:
     * '''
     *	This is a python multiline
     *	comment.
     *	'''
     */

    // Crazy python comments '''

    /* This is a multiline comment in a single line. */
    function test() { /* This is a multiline comment at the end of a line. */
        window.alert(foo);
        window.alert(bar);
    }

    /* This is a multiline comment at the beginning of a line. */ test();

    foo = 'omg';/*
     * This is a really strange multiline comment but valid (more or less)
     */bar = 'wtf';

    /*
     * This one should match as ignore expect the first line.
     *
     *
     *
     *
     *
     */

    /* This is an other format
     /*
     /*
     /* And should match as ignore */

    /* And this too. */

    test(); /* Aaaaand this too. */

    bar = {

        bar: {

            /**
             * handles a static list filter (type == static) based on the defined mode
             * @private
             * @param    {jQuery.Event} event
             */
            a1: 1

            /**
             * handles a static list filter (type == static) based on the defined mode
             * @private
             * @param    {jQuery.Event} event
             */
        }
    };

})();
