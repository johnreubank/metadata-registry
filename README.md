# metadata-registry

This package allows you to register property and class metadata

To create a new registry:
```
import {metadataRegistry} from 'metadata-registry';

metadataRegistry.registerPropertyMetadata('lengthConstraints');
metadataRegistry.registerPropertyMetadata('hideFromView');

```

Once your registry is created, you may add metadata to the property of a class
```
import {ClassPropertyMetadata} from "metadata-registry/lib/metadata/ClassPropertyMetadata";

class LengthConstraintsMetadata extends ClassPropertyMetadata {

  constructor(public target: Object,
              public propertyName: string,
              public min: number,
              public max: number) {
    super(target, propertyName);
  }

}

class HideFromViewMetadata extends ClassPropertyMetadata {

  constructor(public target: Object,
              public propertyName: string
              public hideFromView: boolean = true) {
    super(target, propertyName);
  }

}

// decorator functions
function LengthConstraints(min: number = 0, max: number = 100) {
    return function(object: Object, propertyName: string = '') {
        if (metadataRegistry.registerPropertyMetadata('lengthConstraints') {
            const metadata = new LengthContraintsMetadata(object, propertyName, min, max);
            metadataRegistry.addPropertyMetadata('lengthConstraints', metadata);
        }
    }
}

function HideFromView() {
    return function(object: Object, propertyName: string = '') {
        if (metadataRegistry.registerPropertyMetadata('hideFromView') {
            const metadata = new HideFromViewMetadata(object, propertyName;
            metadataRegistry.addPropertyMetadata('hideFromView', metadata);
        }
    }
}

/**
 * Using TypeScript decorators
 */
class Person {

    // we would like to know the minimum and maximum length of their name
    @LengthConstraints(2, 4)
    name: string;

    // we would like to know whether to expose the person's hometown throughout our application
    @HideFromView()
    hometown: string;

}


const bob = new Person();
bob.name = 'Bob';
bob.hometown = 'Chicago';

bobsNameConstraints: LengthConstraintsMetadata = metadataRegistry.getPropertyMetadata('lengthConstraints', bob, 'name');

bobsHometownHiddenFromView: boolean = false;
if (metadataRegistry.hasPropertyMetadata('hideFromView', bob, 'hometown')) {
    const hideHometownMetadata: HideFromViewMetadata = metadataRegistry.getPropertyMetadata('hideFromView', bob, 'hometown');
    bobsHometownHiddenFromView = metadata.hideFromView;
}


```