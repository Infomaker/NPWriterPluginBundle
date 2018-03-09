import { AnnotationComponent as SuperAnnotationComponent } from 'substance';
import { newsmlTags } from '../config';

class AnnotationComponent extends SuperAnnotationComponent {
    getTagName() {
        return newsmlTags.NODE;
    }
}

export default AnnotationComponent;
