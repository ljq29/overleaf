import CodeMirrorEditor from '../../../../frontend/js/features/source-editor/components/codemirror-editor'
import { EditorProviders } from '../../helpers/editor-providers'
import { mockScope } from '../source-editor/helpers/mock-scope'

type ContainerProps = {
  children: React.ReactNode
  className?: string
}

function Container(props: ContainerProps) {
  return <div style={{ width: 785, height: 785 }} {...props} />
}

describe('<ReviewPanel />', function () {
  beforeEach(function () {
    window.metaAttributesCache.set('ol-isReviewPanelReact', true)
    window.metaAttributesCache.set('ol-preventCompileOnLoad', true)

    cy.interceptEvents()
    cy.interceptSpelling()

    const scope = mockScope('')
    scope.editor.showVisual = true

    // Making a shallow copy, otherwise cannot spy on an object declared outside the test file
    const newScope = { ...scope }
    cy.spy(newScope, 'toggleTrackChangesForEveryone').as(
      'toggleTrackChangesForEveryone'
    )

    cy.mount(
      <Container className="rp-size-expanded">
        <EditorProviders scope={newScope}>
          <CodeMirrorEditor />
        </EditorProviders>
      </Container>
    )

    cy.findByTestId('review-panel').as('review-panel')
  })

  describe('toolbar', function () {
    describe('resolved comments dropdown', function () {
      it('renders dropdown button', function () {
        cy.findByRole('button', { name: /resolved comments/i })
      })

      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('opens dropdown', function () {})

      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('renders list of resolved comments', function () {})

      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('reopens resolved comment', function () {})

      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('deletes resolved comment', function () {})
    })

    describe('track changes toggle menu', function () {
      it('renders track changes toolbar', function () {
        cy.get('@review-panel').within(() => {
          cy.findByRole('button', { name: /track changes is (on|off)$/i })
        })
      })

      it('opens/closes toggle menu', function () {
        cy.get('@review-panel').within(() => {
          cy.findByTestId('review-panel-track-changes-menu').as('menu')
          cy.get('@menu').should('have.css', 'height', '1px')
          cy.findByRole('button', { name: /track changes is/i }).click()
          // verify the menu is expanded
          cy.get('@menu')
            .then($el => {
              const height = window
                .getComputedStyle($el[0])
                .getPropertyValue('height')
              return parseFloat(height)
            })
            .should('be.gt', 1)
          cy.findByRole('button', { name: /track changes is/i }).click()
          cy.get('@menu').should('have.css', 'height', '1px')
        })
      })

      it('toggles the "everyone" track changes switch', function () {
        cy.get('@review-panel').within(() => {
          cy.findByRole('button', { name: /track changes is off/i }).click()
          cy.findByLabelText(/track changes for everyone/i).click({
            force: true,
          })
          cy.get('@toggleTrackChangesForEveryone').should('be.calledOnce')
        })
      })

      it('renders track changes with "on" state', function () {
        const scope = mockScope('')
        scope.editor.showVisual = true
        scope.editor.wantTrackChanges = true

        cy.mount(
          <Container className="rp-size-expanded">
            <EditorProviders scope={scope}>
              <CodeMirrorEditor />
            </EditorProviders>
          </Container>
        )

        cy.findByTestId('review-panel').within(() => {
          cy.findByRole('button', { name: /track changes is on/i }).click()
        })
      })

      it('renders a disabled guests switch', function () {
        cy.findByRole('button', { name: /track changes is off/i }).click()
        cy.findByLabelText(/track changes for guests/i).should('be.disabled')
      })
    })
  })
})