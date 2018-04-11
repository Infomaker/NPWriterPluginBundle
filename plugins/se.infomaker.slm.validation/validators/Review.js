import {api, Validator} from 'writer'

class Review extends Validator {

    /**
     * Main validation method
     */
    validate() {
        const contentParts = [...this.newsItem.querySelectorAll('idf > group object[type="x-im/content-part"]')]
        const reviews = contentParts.filter(contentPart => {
            return contentPart.querySelector('links link[uri="im:/content-part/recension"]') !== null
        })

        reviews.map(this.validateReviewGrade.bind(this))
    }

    /**
     * Ensure that the review grade is empty or 0-5
     * @param {Object} review
     */
    validateReviewGrade(review) {
        const reviewGradeText = review.getAttribute('title')
        const reviewGrade = parseInt(reviewGradeText, 10)
        const reviewGradeEmpty = (reviewGradeText === '' || reviewGradeText === null)

        if (!reviewGradeEmpty) {
            if (isNaN(reviewGrade) || reviewGrade < 0 || reviewGrade > 5) {
                this.addError(api.getLabel('validator-review-grade-incorrect'))
            }
        }
    }
}

export default Review
