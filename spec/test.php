<?php

namespace My\Cls;

use Not\My\Cls\AnotherClass;
use Not\My\Cls\AnotherClass\SubAnotherClass;
    use Not\My\Cls\AnotherClass\SubAnotherClassWithIndent;
use      Not\My\Cls\AnotherClass\SubAnotherClassWithMultipleSpaceAfterUse;
use
    Not\My\Cls\AnotherClass\UseWithMultipleNamespace,
    Not\My\Cls\AnotherClass\UseWithMultipleNamespace2,
    Not\My\Cls\AnotherClass\UseWithMultipleNamespace3;

/**
 * Test
 */
class Test extends AnotherClass
{
    function __construct()
    {
        $this->useMyFunction();
        $this->myUseFunction();
    }

    function useMyFunction()
    {
    }

    function myUseFunction()
    {
    }

}
