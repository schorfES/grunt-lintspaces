/*
 * This is a multiline comment.
 */
(function() {
	var
		foo = 'baz',
		bar
	;

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
	 * This one should match.
	*/

	 /* And this too. */

	 test(); /* Aaaaand this too. */
})();
